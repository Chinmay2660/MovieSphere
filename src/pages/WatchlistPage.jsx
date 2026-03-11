import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromWatchlist } from "../reduxStore/Reducer/watchlistSlice";
import { IoPlay, IoTrashOutline } from "react-icons/io5";
import moment from "moment";

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

  const handlePlay = (item) => {
    if (item.type === "movie") {
      navigate(`/movie/${item.id}`, { state: { autoPlay: true } });
    } else {
      navigate(`/tv/${item.tv_id}`, {
        state: {
          autoPlay: true,
          initialSeason: item.season_number,
          initialEpisode: item.episode_number,
        },
      });
    }
  };

  return (
    <div className="pt-16 min-h-screen text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-2">Watchlist</h1>
        <p className="text-white/70 mb-8">
          Movies and episodes you added. Click a card to start watching.
        </p>

        {items.length === 0 && (
          <div className="text-center py-16 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/70 text-lg">Your watchlist is empty</p>
            <p className="text-white/50 text-sm mt-1">
              Add movies from their detail page, or add episodes individually from a TV show&apos;s Seasons & Episodes section.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <div
              key={
                item.type === "movie"
                  ? `movie-${item.id ?? idx}`
                  : `ep-${item.tv_id ?? ""}-${item.season_number ?? ""}-${item.episode_number ?? ""}-${idx}`
              }
              className="relative flex flex-col h-full bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 hover:scale-[1.02] transition-all text-left group border border-white/10"
            >
              <button
                onClick={() => handlePlay(item)}
                className="flex-1 min-h-0 flex flex-col w-full text-left"
              >
                <div className="relative">
                  {(item.type === "movie" ? item.poster_path : item.still_path) &&
                  imageURL ? (
                    <img
                      src={
                        imageURL +
                        (item.type === "movie"
                          ? item.poster_path
                          : item.still_path)
                      }
                      alt={item.type === "movie" ? item.title : item.episode_name}
                      className="w-full h-28 sm:h-32 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-28 sm:h-32 bg-black/40 flex items-center justify-center">
                      <span className="text-white/40 text-sm">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white rounded-full p-3">
                      <IoPlay className="w-6 h-6 text-black" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                    {item.type === "movie"
                      ? "Movie"
                      : `E${item.episode_number}`}
                  </div>
                </div>
                <div className="p-3">
                  {item.type === "movie" ? (
                    <>
                      <h5 className="font-medium text-white text-sm line-clamp-1">
                        {item.title}
                      </h5>
                      {item.release_date && (
                        <span className="text-xs text-white/50 mt-1 block">
                          {moment(item.release_date).format("YYYY")}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-white/50 text-xs line-clamp-1">
                        {item.show_name}
                      </p>
                      <h5 className="font-medium text-white text-sm line-clamp-1 mt-0.5">
                        {item.episode_name}
                      </h5>
                      <span className="text-xs text-white/50 mt-1 block">
                        S{item.season_number} E{item.episode_number}
                      </span>
                    </>
                  )}
                </div>
              </button>
              <button
                onClick={(e) => handleRemove(e, item)}
                className="mt-auto w-full py-1.5 px-2 rounded-lg text-xs font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-1.5 flex-shrink-0"
              >
                <IoTrashOutline className="w-3.5 h-3.5" />
                Remove from Watchlist
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchlistPage;
