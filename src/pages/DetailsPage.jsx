import { useParams, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axiosConfig";
import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Divider from "../components/Reusables/Divider";
import LazyImage from "../components/Reusables/LazyImage";
import Loader from "../components/Reusables/Loader";
import CardCarousel from "../components/Home/CardCarousel";
import { IoPlay, IoStar, IoCalendar, IoTime, IoTv, IoExpand, IoAddOutline, IoCheckmarkOutline, IoDownloadOutline } from "react-icons/io5";
import CastCarousel from "../components/CastCarousel";
import { getRatingColor, formatYear, formatLongDate } from "../lib/utils";
import { addToWatchlist, removeFromWatchlist } from "../reduxStore/Reducer/watchlistSlice";
import { getDownloadKey, selectDownloadByKey } from "../reduxStore/Reducer/downloadsSlice";
import { startDownload } from "../lib/downloadService";
import { Link } from "react-router-dom";
import { USER_MESSAGES } from "../lib/userFriendlyError";
import { useLocale } from "../context/LocaleContext";

const VideoPlay = lazy(() => import("../components/VideoPlay"));
const DetailsPage = () => {
  const { t } = useLocale();
  const params = useParams();
  const isTV = params?.explore === 'tv';
  const location = useLocation();
  const navigate = useNavigate();
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const [data, setData] = useState(null);
  const [castData, setCastData] = useState(null);
  const [similarData, setSimilarData] = useState(null);
  const [recommendationsData, setRecommendationsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playVideo, setPlayVideo] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);
  const [playConfig, setPlayConfig] = useState({ season: 1, episode: 1 });
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist);
  const downloads = useSelector((state) => state.downloads);
  const movieInWatchlist = useSelector((state) =>
    state.watchlist.some(
      (i) => i.type === "movie" && i.id === data?.id
    )
  );

  const movieDownloadKey = data && !isTV ? getDownloadKey({ type: "movie", id: data.id }) : null;
  const movieDownloadFromStore = useSelector((state) =>
    movieDownloadKey ? selectDownloadByKey(state, movieDownloadKey) : null
  );
  const tvDownload = isTV && data
    ? downloads.find(
        (d) =>
          d.type === "episode" &&
          String(d.tv_id) === String(params?.id) &&
          d.season_number === (selectedSeason || 1) &&
          d.episode_number === 1
      )
    : null;
  const movieDownload = isTV ? tvDownload : movieDownloadFromStore;

  const handleDownloadMovie = () => {
    if (!data || movieDownload?.status === "downloading" || movieDownload?.status === "queued") return;
    if (isTV) {
      const season = selectedSeason || 1;
      const firstEp = seasonDetails?.episodes?.find((e) => e.episode_number === 1) ?? {
        episode_number: 1,
        name: "Episode 1",
        still_path: null,
      };
      handleDownloadEpisode(firstEp, season);
      return;
    }
    startDownload({
      type: "movie",
      id: data.id,
      title: data?.title ?? data?.original_title ?? data?.name,
      poster_path: data?.poster_path ?? null,
      media_type: "movie",
    }, dispatch);
  };

  const handleDownloadEpisode = (episode, seasonNum) => {
    const key = getDownloadKey({
      type: "episode",
      tv_id: params?.id,
      season_number: seasonNum,
      episode_number: episode.episode_number,
    });
    const existing = downloads.find((d) => d.key === key);
    if (existing?.status === "downloading" || existing?.status === "queued") return;
    startDownload({
      type: "episode",
      tv_id: params?.id,
      season_number: seasonNum,
      episode_number: episode.episode_number,
      show_name: data?.name,
      episode_name: episode.name,
      still_path: episode.still_path ?? null,
      media_type: "tv",
    }, dispatch);
  };

  const getEpisodeDownload = (seasonNum, episodeNum) =>
    downloads.find(
      (d) =>
        d.type === "episode" &&
        String(d.tv_id) === String(params?.id) &&
        d.season_number === seasonNum &&
        d.episode_number === episodeNum
    );

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [detailsResponse, castResponse, similarResponse, recommendationsResponse] = await Promise.all([
        axiosInstance.get(`/${params?.explore}/${params?.id}`),
        axiosInstance.get(`/${params?.explore}/${params?.id}/credits`),
        axiosInstance.get(`/${params?.explore}/${params?.id}/similar`),
        axiosInstance.get(`/${params?.explore}/${params?.id}/recommendations`)
      ]);
      setData(detailsResponse.data);
      setCastData(castResponse.data);
      setSimilarData(similarResponse.data.results);
      setRecommendationsData(recommendationsResponse.data.results);
      
      if (params?.explore === 'tv' && detailsResponse.data.seasons?.length > 0) {
        const seasons = detailsResponse.data.seasons;
        const stateSeason = location.state?.initialSeason;
        const fromState =
          stateSeason != null
            ? seasons.find((s) => s.season_number === stateSeason)
            : null;
        const firstValidSeason = fromState ?? seasons.find((s) => s.season_number > 0);
        if (firstValidSeason) {
          setSelectedSeason(firstValidSeason.season_number);
        }
      }
    } catch {
      setError(USER_MESSAGES.loadContent);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasonDetails = async (seasonNumber) => {
    if (!isTV || !seasonNumber) return;
    try {
      const response = await axiosInstance.get(`/tv/${params?.id}/season/${seasonNumber}`);
      setSeasonDetails(response.data);
    } catch {
      // Season details are optional until user selects a season
    }
  };

  useEffect(() => {
    fetchData();
    setShowAllEpisodes(false);
  }, [params?.explore, params?.id]);

  useEffect(() => {
    if (selectedSeason) {
      fetchSeasonDetails(selectedSeason);
      setShowAllEpisodes(false);
    }
  }, [selectedSeason, params?.id]);

  useEffect(() => {
    if (loading || !data) return;
    const state = location.state;
    if (state?.autoPlay) {
      if (params?.explore === "tv" && state.initialSeason != null && state.initialEpisode != null) {
        setPlayConfig({ season: state.initialSeason, episode: state.initialEpisode });
        setSelectedSeason(state.initialSeason);
      } else {
        setPlayConfig({ season: 1, episode: 1 });
      }
      setPlayVideo(true);
      navigate(location.pathname, { replace: true, state: {} });
    } else if (state?.initialSeason != null) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [loading, data, location.state, location.pathname, params?.explore, navigate]);

  const handlePlayEpisode = (seasonNum, episodeNum) => {
    setPlayConfig({ season: seasonNum, episode: episodeNum });
    setPlayVideo(true);
  };

  const handlePlayClick = () => {
    if (isTV) {
      setPlayConfig({ season: selectedSeason || 1, episode: 1 });
    } else {
      setPlayConfig({ season: 1, episode: 1 });
    }
    setPlayVideo(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader
          size="lg"
          label={isTV ? t('loading.tvDetails') : t('loading.movieDetails')}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-tertiary text-lg">{error}</span>
      </div>
    );
  }

  const duration = data?.runtime ? (Number(data?.runtime) / 60).toFixed(1).split(".") : null;
  const directorName = castData?.crew?.filter((item) => item?.job === "Director").map((item) => item?.name).join(", ");
  const writerName = castData?.crew?.filter((item) => item?.job === "Writer" || item?.job === "Screenplay").map((item) => item?.name).join(", ");
  const creatorName = data?.created_by?.map(c => c.name).join(", ");
  
  const displayedEpisodes = showAllEpisodes 
    ? seasonDetails?.episodes 
    : seasonDetails?.episodes?.slice(0, 8);

  return (
    <div className="apple-page text-text lg:pt-0">
      <div className="w-full h-[300px] sm:h-[400px] relative hidden lg:block">
        {imageURL && data?.backdrop_path && (
          <LazyImage
            src={imageURL + data?.backdrop_path}
            alt="Banner"
            eager
            className="h-full w-full object-cover"
            width="1920"
            height="400"
          />
        )}
        <div className="absolute w-full h-full top-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
      </div>

      <div className="apple-container flex max-w-screen-xl flex-col gap-6 py-6 sm:gap-8 sm:py-8 lg:flex-row lg:gap-10">
        <div className="relative mx-auto lg:-mt-48 lg:mx-0 flex-shrink-0">
          {imageURL && data?.poster_path ? (
            <LazyImage
              src={imageURL + data?.poster_path}
              alt="Poster"
              eager
              className="h-72 w-48 lg:h-96 lg:w-64 object-cover rounded-xl shadow-2xl"
            />
          ) : (
            <div className="h-72 w-48 lg:h-96 lg:w-64 bg-surface rounded-xl flex items-center justify-center">
              <span className="text-muted">No Image</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="apple-title-1 lg:apple-large-title">
            {data?.title ?? data?.original_title ?? data?.name}
          </h1>
          {data?.tagline && (
            <p className="apple-callout mt-2 italic text-secondary">"{data.tagline}"</p>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-3">
            {data?.vote_average > 0 && (() => {
              const { text, bg } = getRatingColor(data.vote_average);
              return (
                <div className={`flex items-center gap-1 ${bg} ${text} px-3 py-1 rounded-full`}>
                  <IoStar className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{Number(data.vote_average).toFixed(1)}</span>
                </div>
              );
            })()}
            {(data?.release_date || data?.first_air_date) && (
              <div className="flex items-center gap-1 text-secondary">
                <IoCalendar className="w-4 h-4" />
                <span>{formatYear(data?.release_date || data?.first_air_date)}</span>
              </div>
            )}
            {duration && (
              <div className="flex items-center gap-1 text-secondary">
                <IoTime className="w-4 h-4" />
                <span>{duration[0]}h {duration[1]}m</span>
              </div>
            )}
            {isTV && data?.number_of_seasons && (
              <div className="flex items-center gap-1 text-secondary">
                <IoTv className="w-4 h-4" />
                <span>{data.number_of_seasons} Season{data.number_of_seasons > 1 ? 's' : ''}</span>
              </div>
            )}
            {isTV && data?.number_of_episodes && (
              <div className="flex items-center gap-1 text-secondary">
                <span>{data.number_of_episodes} Episodes</span>
              </div>
            )}
          </div>

          {data?.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {data.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="text-sm font-medium text-text/90 bg-surface-elevated border border-accent/20 px-3 py-1.5 rounded-lg"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-col items-start gap-3">
            <motion.button
              onClick={handlePlayClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary inline-flex items-center justify-center gap-2.5 px-6 py-2.5 active:scale-[0.97]"
            >
              <IoPlay className="w-5 h-5 text-primary-fg" />
              <span>{isTV ? "Watch S1 E1" : "Play Now"}</span>
            </motion.button>
            <div className="flex flex-wrap items-stretch gap-3">
              <button
                onClick={handleDownloadMovie}
                disabled={movieDownload?.status === "downloading" || movieDownload?.status === "queued"}
                className="inline-flex items-center justify-center gap-1.5 min-h-[var(--spacing-touch)] px-4 rounded-xl text-sm font-medium bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IoDownloadOutline className="w-4 h-4 shrink-0" />
                <span>
                  {movieDownload?.status === "completed"
                    ? "Downloaded"
                    : movieDownload?.status === "downloading" || movieDownload?.status === "queued"
                      ? `Downloading ${movieDownload.progress}%`
                      : isTV
                        ? `Download S${selectedSeason || 1} E1`
                        : "Download"}
                </span>
              </button>
              {!isTV && (
                <button
                  onClick={() => {
                    if (movieInWatchlist) {
                      dispatch(removeFromWatchlist({
                        type: "movie",
                        id: data.id,
                      }));
                    } else {
                      dispatch(addToWatchlist({
                        type: "movie",
                        id: data.id,
                        media_type: "movie",
                        title: data?.title ?? data?.original_title,
                        poster_path: data?.poster_path ?? null,
                        release_date: data?.release_date ?? null,
                      }));
                    }
                  }}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[var(--spacing-touch)] px-4 rounded-xl text-sm font-medium bg-surface-elevated border border-accent/20 text-text hover:bg-surface-elevated transition-colors"
                >
                  {movieInWatchlist ? (
                    <>
                      <IoCheckmarkOutline className="w-4 h-4 shrink-0 text-green-400" />
                      <span>In Watchlist</span>
                    </>
                  ) : (
                    <>
                      <IoAddOutline className="w-4 h-4 shrink-0" />
                      <span>Add to Watchlist</span>
                    </>
                  )}
                </button>
              )}
              {movieDownload && (movieDownload.status === "downloading" || movieDownload.status === "queued") && (
                <Link
                  to="/downloads"
                  className="inline-flex items-center self-center text-xs text-primary hover:text-primary/80 underline"
                >
                  View progress
                </Link>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold text-text mb-2">Overview</h3>
            <p className="text-text/80 leading-relaxed">{data?.overview}</p>
            </div>

            <Divider />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-muted">Status</span>
              <p className="text-text font-medium">{data?.status}</p>
            </div>
            <div>
              <span className="text-muted">{isTV ? "First Air Date" : "Release Date"}</span>
              <p className="text-text font-medium">
                {formatLongDate(data?.release_date || data?.first_air_date)}
              </p>
            </div>
            {isTV && data?.last_air_date && (
              <div>
                <span className="text-muted">Last Air Date</span>
                <p className="text-text font-medium">
                  {formatLongDate(data.last_air_date)}
                </p>
              </div>
            )}
            {directorName && (
              <div>
                <span className="text-muted">Director</span>
                <p className="text-text font-medium">{directorName}</p>
              </div>
            )}
            {creatorName && (
              <div>
                <span className="text-muted">Creator</span>
                <p className="text-text font-medium">{creatorName}</p>
              </div>
            )}
            {writerName && (
              <div>
                <span className="text-muted">Writer</span>
                <p className="text-text font-medium">{writerName}</p>
              </div>
            )}
            {data?.networks?.length > 0 && (
              <div>
                <span className="text-muted">Network</span>
                <p className="text-text font-medium">
                  {data.networks.map(n => n.name).join(", ")}
                </p>
              </div>
            )}
            {data?.production_companies?.length > 0 && (
              <div>
                <span className="text-muted">Production</span>
                <p className="text-text font-medium">
                  {data.production_companies.slice(0, 3).map(c => c.name).join(", ")}
                </p>
              </div>
            )}
            {!isTV && data?.budget > 0 && (
              <div>
                <span className="text-muted">Budget</span>
                <p className="text-text font-medium">
                  ${(data.budget / 1_000_000).toFixed(1)}M
                </p>
              </div>
            )}
            {!isTV && data?.revenue > 0 && (
              <div>
                <span className="text-muted">Revenue</span>
                <p className="text-text font-medium">
                  ${(data.revenue / 1_000_000).toFixed(1)}M
                </p>
              </div>
            )}
            {data?.spoken_languages?.length > 0 && (
              <div>
                <span className="text-muted">Language(s)</span>
                <p className="text-text font-medium">
                  {data.spoken_languages.map((l) => l.english_name || l.name).join(", ")}
                </p>
              </div>
            )}
            {data?.production_countries?.length > 0 && (
              <div>
                <span className="text-muted">Country</span>
                <p className="text-text font-medium">
                  {data.production_countries.map((c) => c.name).join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isTV && data?.seasons?.filter(s => s.season_number > 0).length > 0 && (
        <div className="container mx-auto px-4 lg:px-8 max-w-screen-xl mb-8">
          <h3 className="text-xl font-bold text-text mb-4">Seasons & Episodes</h3>
          
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
            {data.seasons
              .filter(s => s.season_number > 0)
              .map((season) => (
                <button
                  key={season.id}
                  onClick={() => setSelectedSeason(season.season_number)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedSeason === season.season_number
                      ? 'bg-primary text-primary-fg shadow-lg shadow-primary/25'
                      : 'bg-surface-elevated text-text hover:bg-surface-elevated border border-accent/20'
                  }`}
                >
                  Season {season.season_number}
                  <span className="text-xs opacity-70 ml-1">
                    ({season.episode_count})
                  </span>
                </button>
              ))}
          </div>

          {seasonDetails && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-text">
                  {seasonDetails.name}
                  <span className="text-muted font-normal ml-2">
                    • {seasonDetails.episodes?.length || 0} Episodes
                  </span>
                </h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedEpisodes?.map((episode) => {
                  const episodeItem = {
                    type: "episode",
                    tv_id: params?.id,
                    season_number: selectedSeason,
                    episode_number: episode.episode_number,
                    show_name: data?.name,
                    episode_name: episode.name,
                    still_path: episode.still_path ?? null,
                  };
                  const inWatchlist = watchlist.some(
                    (i) =>
                      i.type === "episode" &&
                      i.tv_id === params?.id &&
                      i.season_number === selectedSeason &&
                      i.episode_number === episode.episode_number
                  );
                  const episodeDownload = getEpisodeDownload(selectedSeason, episode.episode_number);
                  return (
                    <div
                      key={episode.id}
                      className="relative flex flex-col h-full bg-surface-elevated rounded-lg overflow-hidden hover:bg-surface-elevated hover:scale-[1.02] transition-all text-left group border border-accent/15"
                    >
                      <button
                        onClick={() => handlePlayEpisode(selectedSeason, episode.episode_number)}
                        className="flex-1 min-h-0 flex flex-col w-full text-left"
                      >
                        <div className="relative">
                          {episode.still_path ? (
                            <LazyImage
                              src={imageURL + episode.still_path}
                              alt={episode.name}
                              className="w-full h-28 sm:h-32 object-cover"
                            />
                          ) : (
                            <div className="w-full h-28 sm:h-32 bg-surface flex items-center justify-center">
                              <IoTv className="w-8 h-8 text-muted" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-surface opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="bg-primary rounded-full p-3">
                              <IoPlay className="w-6 h-6 text-primary-fg" />
                            </div>
                          </div>
                          <div className="absolute top-2 left-2 bg-surface-elevated text-text text-xs font-bold px-2 py-1 rounded">
                            E{episode.episode_number}
                          </div>
                        </div>
                        <div className="p-3">
                          <h5 className="font-medium text-text text-sm line-clamp-1">
                            {episode.name}
                          </h5>
                          <div className="flex items-center gap-2 mt-1">
                            {episode.vote_average > 0 && (
                              <div className="flex items-center gap-1 text-xs" style={{ color: getRatingColor(episode.vote_average).color }}>
                                <IoStar className="w-3 h-3 fill-current" style={{ color: getRatingColor(episode.vote_average).color }} />
                                <span className="font-medium">{episode.vote_average.toFixed(1)}</span>
                              </div>
                            )}
                            {episode.runtime && (
                              <span className="text-xs text-muted">{episode.runtime}m</span>
                            )}
                          </div>
                          {episode.overview && (
                            <p className="text-xs text-muted mt-2 line-clamp-2">{episode.overview}</p>
                          )}
                        </div>
                      </button>
                      <div className="flex flex-col gap-2 px-3 pb-3 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (inWatchlist) {
                              dispatch(removeFromWatchlist(episodeItem));
                            } else {
                              dispatch(addToWatchlist(episodeItem));
                            }
                          }}
                          className="w-full py-1.5 px-2 rounded-lg text-xs font-medium bg-surface-elevated border border-accent/20 text-text hover:bg-surface-elevated transition-colors flex items-center justify-center gap-1.5"
                        >
                          {inWatchlist ? (
                            <>
                              <IoCheckmarkOutline className="w-3.5 h-3.5 text-green-400" />
                              In Watchlist
                            </>
                          ) : (
                            <>
                              <IoAddOutline className="w-3.5 h-3.5" />
                              Add to Watchlist
                            </>
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadEpisode(episode, selectedSeason);
                          }}
                          disabled={
                            episodeDownload?.status === "downloading" ||
                            episodeDownload?.status === "queued"
                          }
                          className="w-full py-1.5 px-2 rounded-lg text-xs font-medium bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <IoDownloadOutline className="w-3.5 h-3.5" />
                          {episodeDownload?.status === "completed"
                            ? "Downloaded"
                            : episodeDownload?.status === "downloading" || episodeDownload?.status === "queued"
                              ? `${episodeDownload.progress}%`
                              : "Download"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {seasonDetails.episodes?.length > 8 && (
                <button
                  onClick={() => setShowAllEpisodes(!showAllEpisodes)}
                  className="mt-4 flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  <IoExpand className="w-4 h-4" />
                  {showAllEpisodes 
                    ? `Show Less` 
                    : `Show All ${seasonDetails.episodes.length} Episodes`
                  }
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {castData?.cast?.filter((item) => item?.profile_path).length > 0 && (
        <div className="container mx-auto px-4 lg:px-8 max-w-screen-xl">
          <h3 className="text-xl font-bold text-text mb-4">Cast</h3>
          <CastCarousel
            castData={castData?.cast?.filter((item) => item?.profile_path)}
            imageURL={imageURL}
          />
        </div>
      )}

      {similarData?.length > 0 && (
        <CardCarousel
          data={similarData}
          heading={"Similar " + (isTV ? "TV Shows" : "Movies")}
          trending={false}
          media_type={params?.explore}
        />
      )}

      {recommendationsData?.length > 0 && (
        <CardCarousel
          data={recommendationsData}
          heading={"Recommended " + (isTV ? "TV Shows" : "Movies")}
          trending={false}
          media_type={params?.explore}
        />
      )}

      {playVideo && (
        <Suspense fallback={<Loader size="lg" className="fixed inset-0 z-[100] bg-background" />}>
          <VideoPlay
            playVideoId={params?.id}
            media_type={params?.explore}
            close={() => setPlayVideo(false)}
            seasons={data?.seasons}
            initialSeason={playConfig.season}
            initialEpisode={playConfig.episode}
          />
        </Suspense>
      )}
    </div>
  );
};

export default DetailsPage;
