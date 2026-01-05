import { useParams } from "react-router-dom";
import axiosInstance from "../lib/axiosConfig";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImageURL } from "../reduxStore/Reducer/movieSlice";
import moment from "moment";
import Divider from "../components/Reusables/Divider";
import CardCarousel from "../components/Home/CardCarousel";
import { IoPlay, IoStar, IoCalendar, IoTime, IoTv, IoExpand } from "react-icons/io5";
import VideoPlay from "../components/VideoPlay";
import CastCarousel from "../components/CastCarousel";

const DetailsPage = () => {
  const params = useParams();
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

  const isTV = params?.explore === 'tv';

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
      
      // Set default selected season for TV shows
      if (params?.explore === 'tv' && detailsResponse.data.seasons?.length > 0) {
        const firstValidSeason = detailsResponse.data.seasons.find(s => s.season_number > 0);
        if (firstValidSeason) {
          setSelectedSeason(firstValidSeason.season_number);
        }
      }
    } catch (error) {
      setError("Failed to fetch data");
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasonDetails = async (seasonNumber) => {
    if (!isTV || !seasonNumber) return;
    try {
      const response = await axiosInstance.get(`/tv/${params?.id}/season/${seasonNumber}`);
      setSeasonDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch season details", error);
    }
  };

  const fetchConfigurationData = async () => {
    try {
      const response = await axiosInstance.get('/configuration');
      dispatch(setImageURL(response?.data?.images?.secure_base_url + "original"));
    } catch (error) {
      console.log("error", error);
    }
  };

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

  useEffect(() => {
    if (imageURL !== undefined) {
      fetchConfigurationData();
    }
    fetchData();
    setShowAllEpisodes(false);
  }, [params, imageURL]);

  useEffect(() => {
    if (selectedSeason) {
      fetchSeasonDetails(selectedSeason);
      setShowAllEpisodes(false);
    }
  }, [selectedSeason, params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-500 text-lg">{error}</span>
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
    <div className="text-white pt-16 lg:pt-0">
      {/* Backdrop */}
      <div className="w-full h-[300px] sm:h-[400px] relative hidden lg:block">
        {imageURL && data?.backdrop_path && (
          <img
            src={imageURL + data?.backdrop_path}
            alt="Banner"
            className="h-full w-full object-cover"
            loading="lazy"
            width="1920"
            height="400"
          />
        )}
        <div className="absolute w-full h-full top-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-12 flex flex-col lg:flex-row gap-6 lg:gap-10 max-w-screen-xl">
        {/* Poster */}
        <div className="relative mx-auto lg:-mt-48 lg:mx-0 flex-shrink-0">
          {imageURL && data?.poster_path ? (
            <img
              src={imageURL + data?.poster_path}
              alt="Poster"
              className="h-72 w-48 lg:h-96 lg:w-64 object-cover rounded-xl shadow-2xl"
              loading="lazy"
            />
          ) : (
            <div className="h-72 w-48 lg:h-96 lg:w-64 bg-neutral-800 rounded-xl flex items-center justify-center">
              <span className="text-neutral-500">No Image</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-2xl lg:text-4xl font-bold">
            {data?.title ?? data?.original_title ?? data?.name}
          </h1>
          {data?.tagline && (
            <p className="text-neutral-400 mt-2 italic text-lg">"{data.tagline}"</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {data?.vote_average > 0 && (
              <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                <IoStar className="w-4 h-4" />
                <span className="font-semibold">{Number(data.vote_average).toFixed(1)}</span>
              </div>
            )}
            {(data?.release_date || data?.first_air_date) && (
              <div className="flex items-center gap-1 text-neutral-400">
                <IoCalendar className="w-4 h-4" />
                <span>{moment(data?.release_date || data?.first_air_date).format("YYYY")}</span>
              </div>
            )}
            {duration && (
              <div className="flex items-center gap-1 text-neutral-400">
                <IoTime className="w-4 h-4" />
                <span>{duration[0]}h {duration[1]}m</span>
              </div>
            )}
            {isTV && data?.number_of_seasons && (
              <div className="flex items-center gap-1 text-neutral-400">
                <IoTv className="w-4 h-4" />
                <span>{data.number_of_seasons} Season{data.number_of_seasons > 1 ? 's' : ''}</span>
              </div>
            )}
            {isTV && data?.number_of_episodes && (
              <div className="flex items-center gap-1 text-neutral-400">
                <span>{data.number_of_episodes} Episodes</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {data?.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {data.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="text-sm font-medium border border-primary/50 text-primary px-3 py-1 rounded-full bg-primary/10"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Play Button */}
          <button
            onClick={handlePlayClick}
            className="flex items-center gap-2 py-3 px-8 text-black font-bold bg-gradient-to-r from-primary to-accent mt-6 hover:opacity-90 active:scale-95 rounded-full shadow-lg transition-all"
          >
            <IoPlay className="w-6 h-6" />
            <span>{isTV ? "Watch S1 E1" : "Play Now"}</span>
          </button>

          {/* Overview */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-3">Overview</h3>
            <p className="text-neutral-300 leading-relaxed">{data?.overview}</p>
            </div>

            <Divider />

          {/* Additional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-neutral-500">Status</span>
              <p className="text-white font-medium">{data?.status}</p>
            </div>
            <div>
              <span className="text-neutral-500">{isTV ? "First Air Date" : "Release Date"}</span>
              <p className="text-white font-medium">
                {moment(data?.release_date || data?.first_air_date).format("MMMM Do, YYYY")}
              </p>
            </div>
            {isTV && data?.last_air_date && (
              <div>
                <span className="text-neutral-500">Last Air Date</span>
                <p className="text-white font-medium">
                  {moment(data.last_air_date).format("MMMM Do, YYYY")}
                </p>
              </div>
            )}
            {directorName && (
              <div>
                <span className="text-neutral-500">Director</span>
                <p className="text-white font-medium">{directorName}</p>
              </div>
            )}
            {creatorName && (
              <div>
                <span className="text-neutral-500">Creator</span>
                <p className="text-white font-medium">{creatorName}</p>
              </div>
            )}
            {writerName && (
              <div>
                <span className="text-neutral-500">Writer</span>
                <p className="text-white font-medium">{writerName}</p>
              </div>
            )}
            {data?.networks?.length > 0 && (
              <div>
                <span className="text-neutral-500">Network</span>
                <p className="text-white font-medium">
                  {data.networks.map(n => n.name).join(", ")}
                </p>
              </div>
            )}
            {data?.production_companies?.length > 0 && (
              <div>
                <span className="text-neutral-500">Production</span>
                <p className="text-white font-medium">
                  {data.production_companies.slice(0, 3).map(c => c.name).join(", ")}
                </p>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Seasons & Episodes Section for TV Shows */}
      {isTV && data?.seasons?.filter(s => s.season_number > 0).length > 0 && (
        <div className="container mx-auto px-4 lg:px-8 max-w-screen-xl mb-8">
          <h3 className="text-xl font-bold text-white mb-4">📺 Seasons & Episodes</h3>
          
          {/* Season Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
            {data.seasons
              .filter(s => s.season_number > 0)
              .map((season) => (
                <button
                  key={season.id}
                  onClick={() => setSelectedSeason(season.season_number)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedSeason === season.season_number
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  Season {season.season_number}
                  <span className="text-xs opacity-70 ml-1">
                    ({season.episode_count})
                  </span>
                </button>
              ))}
          </div>

          {/* Episodes Grid */}
          {seasonDetails && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">
                  {seasonDetails.name}
                  <span className="text-neutral-400 font-normal ml-2">
                    • {seasonDetails.episodes?.length || 0} Episodes
                  </span>
                </h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedEpisodes?.map((episode) => (
                  <button
                    key={episode.id}
                    onClick={() => handlePlayEpisode(selectedSeason, episode.episode_number)}
                    className="bg-neutral-800/50 rounded-lg overflow-hidden hover:bg-neutral-700/70 hover:ring-2 hover:ring-primary/50 transition-all text-left group"
                  >
                    <div className="relative">
                      {episode.still_path ? (
                        <img
                          src={imageURL + episode.still_path}
                          alt={episode.name}
                          className="w-full h-28 sm:h-32 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-28 sm:h-32 bg-neutral-700 flex items-center justify-center">
                          <IoTv className="w-8 h-8 text-neutral-500" />
                        </div>
                      )}
                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-primary rounded-full p-3">
                          <IoPlay className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      {/* Episode Badge */}
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                        E{episode.episode_number}
                      </div>
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-white text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {episode.name}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        {episode.vote_average > 0 && (
                          <div className="flex items-center gap-1">
                            <IoStar className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-neutral-400">{episode.vote_average.toFixed(1)}</span>
                          </div>
                        )}
                        {episode.runtime && (
                          <span className="text-xs text-neutral-500">{episode.runtime}m</span>
                        )}
                      </div>
                      {episode.overview && (
                        <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{episode.overview}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Show More/Less Button */}
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

      {/* Cast Section */}
      {castData?.cast?.filter((item) => item?.profile_path).length > 0 && (
        <div className="container mx-auto px-4 lg:px-8 max-w-screen-xl">
          <h3 className="text-xl font-bold text-white mb-4">🎭 Cast</h3>
          <CastCarousel
            castData={castData?.cast?.filter((item) => item?.profile_path)}
            imageURL={imageURL}
          />
        </div>
      )}

      {/* Similar & Recommendations */}
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

      {/* Video Player Modal */}
      {playVideo && (
        <VideoPlay
          playVideoId={params?.id}
          media_type={params?.explore}
          close={() => setPlayVideo(false)}
          seasons={data?.seasons}
          initialSeason={playConfig.season}
          initialEpisode={playConfig.episode}
        />
      )}
    </div>
  );
};

export default DetailsPage;
