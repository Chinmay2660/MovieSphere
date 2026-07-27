import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromWatchlist } from "../reduxStore/Reducer/watchlistSlice";
import { IoTrashOutline } from "react-icons/io5";
import { formatYear } from "../lib/utils";
import LazyImage from "../components/Reusables/LazyImage";

const WatchlistPage = () => {
  const items = useSelector((state) => state.watchlist);
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.type === "movie") {
      dispatch(removeFromWatchlist({ type: "movie", id: item.id }));
    } else {
      dispatch(removeFromWatchlist({
        type: "episode",
        tv_id: item.tv_id,
        season_number: item.season_number,
        episode_number: item.episode_number,
      }));
    }
  };

  const handleOpenDetails = (item) => {
    if (item.type === "movie") {
      navigate(`/movie/${item.id}`);
    } else {
      navigate(`/tv/${item.tv_id}`, {
        state: { initialSeason: item.season_number },
      });
    }
  };

  return (
    <div className="apple-page">
      <div
        className={`apple-container py-6 sm:py-8${
          items.length === 0 ? " flex flex-1 flex-col justify-center" : ""
        }`}
      >
        <header className="apple-section-header">
          <h1 className="apple-large-title text-text">Watchlist</h1>
          <p className="apple-subheadline mt-2">
            Movies and episodes you added. Tap a card to view details.
          </p>
        </header>

        {items.length === 0 && (
          <div className="apple-content-box apple-empty-state">
            <p className="apple-headline text-secondary">Your watchlist is empty</p>
            <p className="apple-footnote mx-auto mt-2 max-w-sm">
              Add movies from their detail page, or add episodes from a series&apos; Seasons & Episodes section.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, idx) => (
            <div
              key={
                item.type === "movie"
                  ? `movie-${item.id ?? idx}`
                  : `ep-${item.tv_id ?? ""}-${item.season_number ?? ""}-${item.episode_number ?? ""}-${idx}`
              }
              className="apple-content-box flex flex-col overflow-hidden p-0"
            >
              <button
                onClick={() => handleOpenDetails(item)}
                className="flex min-h-0 flex-1 flex-col text-left"
              >
                <div className="relative">
                  {(item.type === "movie" ? item.poster_path : item.still_path) && imageURL ? (
                    <LazyImage
                      src={imageURL + (item.type === "movie" ? item.poster_path : item.still_path)}
                      alt={item.type === "movie" ? item.title : item.episode_name}
                      className="h-32 w-full object-cover sm:h-36"
                    />
                  ) : (
                    <div className="flex h-32 items-center justify-center sm:h-36">
                      <span className="apple-footnote">No image</span>
                    </div>
                  )}
                  <div className="glass-pill absolute top-2 left-2 apple-caption-2 font-semibold text-text">
                    {item.type === "movie" ? "Movie" : `E${item.episode_number}`}
                  </div>
                </div>
                <div className="p-4">
                  {item.type === "movie" ? (
                    <>
                      <h2 className="apple-headline line-clamp-1">{item.title}</h2>
                      {item.release_date && (
                        <span className="apple-caption-1 mt-1 block">
                          {formatYear(item.release_date)}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="apple-caption-1 line-clamp-1">{item.show_name}</p>
                      <h2 className="apple-headline mt-0.5 line-clamp-1">{item.episode_name}</h2>
                      <span className="apple-caption-1 mt-1 block">
                        S{item.season_number} E{item.episode_number}
                      </span>
                    </>
                  )}
                </div>
              </button>
              <button
                onClick={(e) => handleRemove(e, item)}
                className="btn-secondary mx-4 mb-4 gap-1.5"
              >
                <IoTrashOutline className="h-4 w-4" />
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchlistPage;
