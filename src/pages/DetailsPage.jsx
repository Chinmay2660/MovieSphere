import { useParams } from "react-router-dom";
import axiosInstance from "../lib/axiosConfig";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImageURL } from "../reduxStore/Reducer/movieSlice";
import moment from "moment";
import Divider from "../components/Reusables/Divider";
import CardCarousel from "../components/Home/CardCarousel";
import { IoPlay } from "react-icons/io5";
import VideoPlay from "../components/VideoPlay";

const DetailsPage = () => {
  const params = useParams();
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const [data, setData] = useState();
  const [castData, setCastData] = useState();
  const [similarData, setSimilarData] = useState();
  const [recommendationsData, setRecommendationsData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playVideo, setPlayVideo] = useState(false);
  const dispatch = useDispatch();

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
    } catch (error) {
      setError("Failed to fetch data");
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    if (imageURL !== undefined) {
      fetchConfigurationData();
    }
    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="text-center my-4">
        <span>Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center my-4">
        <span className="text-red-500">{error}</span>
      </div>
    )
  }

  const duration = (Number(data?.runtime) / 60).toFixed(1).split(".");
  const directorName = castData?.crew?.filter((item) => item?.job === "Director").map((item) => item?.name).join(", ");
  const writerName = castData?.crew?.filter((item) => item?.job === "Writer").map((item) => item?.name).join(", ");

  return (
    <div className="text-white pt-16 lg:pt-0">
      <div className="w-full h-[200px] sm:h-[300px] relative hidden lg:block">
        <img
          src={imageURL + data?.backdrop_path}
          alt="Banner"
          className="h-full w-full object-cover"
          loading="lazy"
          width="100%"
          height="100%"
        />
       <div className="absolute w-full h-full top-0 bg-gradient-to-b from-transparent to-background opacity-100"></div>
      </div>

      <div className="container mx-auto px-3 py-8 lg:py-16 flex flex-col lg:flex-row gap-5 lg:gap-10 max-w-screen-xl">
        <div className="relative mx-auto lg:-mt-40 lg:mx-0 w-fit">
          <img
            src={imageURL + data?.poster_path}
            alt="Poster"
            className="h-60 w-40 lg:h-80 lg:w-60 object-cover rounded"
            loading="lazy"
            width="100%"
            height="100%"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-xl lg:text-3xl font-bold">{data.title ?? data.original_title ?? data.name}</h2>
          <p className="text-neutral-400 mt-1 text-sm lg:text-base">{data.tagline}</p>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
            {data?.vote_average !== undefined && data?.vote_average !== null && data?.vote_average !== "" && data?.vote_average !== 0 && <p className="text-tertiary mt-1 text-sm lg:text-base">Rating: {Number(data?.vote_average).toFixed(1)}+</p>}
            {data?.vote_count !== undefined && data?.vote_count !== null && data?.vote_count !== "" && data?.vote_count !== 0 && <span className="hidden lg:inline">|</span>}
            {data?.vote_count !== undefined && data?.vote_count !== null && data?.vote_count !== "" && data?.vote_count !== 0 && <p className="text-tertiary mt-1 text-sm lg:text-base">Views: {Number(data?.vote_count)}+</p>}
            {data?.runtime !== undefined && data?.runtime !== null && data?.runtime !== "" && data?.runtime !== 0 && <span className="hidden lg:inline">|</span>}
            {data?.runtime !== undefined && data?.runtime !== null && data?.runtime !== "" && data?.runtime !== 0 && <p className="text-tertiary mt-1 text-sm lg:text-base">Duration: {duration[0]}h {duration[1]}m</p>}
          </div>

          {data?.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 mb-4">
              {data?.genres?.map((genre, index) => (
                <button
                  key={index}
                  className="text-sm lg:text-base font-bold border border-tertiary px-3 py-1 rounded-full hover:bg-tertiary hover:text-black transition duration-300"
                >
                  {genre?.name}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setPlayVideo(true)}
            className="flex items-center gap-2 py-2 lg:py-3 px-4 lg:px-6 text-center text-black text-sm lg:text-base font-bold bg-text mt-4 mb-4  hover:bg-secondary active:shadow-none rounded-lg shadow"
          >
            <IoPlay className="w-5 h-5 lg:w-6 lg:h-6 transition-colors duration-300" />
            <span>Play Now</span>
          </button>

          <div>
            <h3 className="text-lg lg:text-xl text-white mt-2 font-bold">Overview</h3>
            <p className="text-neutral-300 text-sm lg:text-base mt-2 overflow-auto">{data?.overview}</p>

            <Divider />

            <div className="flex flex-col lg:flex-row items-start lg:items-center my-2 gap-3">
              <p><span className="text-sm lg:text-base text-white font-bold">Status</span>: {data?.status}</p>
              <span className="hidden lg:inline text-white">|</span>
              <p><span className="text-sm lg:text-base text-white font-bold">Release Date:</span> {moment(data?.release_date ? data?.release_date : data?.first_air_date).format("MMMM Do YYYY")}</p>
            </div>

            <Divider />

            <div>
              {directorName && <p><span className="text-sm lg:text-base text-white font-bold">Direction</span>: {directorName}</p>}
              {directorName && <Divider />}
              {writerName && <p><span className="text-sm lg:text-base text-white font-bold">Writer</span>: {writerName}</p>}
              {writerName && <Divider />}
            </div>

            <h2 className="text-sm lg:text-base text-white font-bold mb-6">Cast:</h2>
            <div className="grid grid-cols-[repeat(auto-fit,80px)] lg:grid-cols-[repeat(auto-fit,96px)] gap-5">
              {castData?.cast?.filter((item) => item?.profile_path).map((item, index) => (
                <div key={index} className="flex flex-col items-center justify-start">
                  <img
                    src={imageURL + item?.profile_path}
                    alt="Cast"
                    className="h-20 w-20 lg:h-24 lg:w-24 object-cover rounded-full"
                    loading="lazy"
                  />
                  <div className="text-center mt-2 leading-tight">
                    <p className="text-neutral-400 font-bold text-xs lg:text-sm">{item?.name.split(" ")[0]}</p>
                    <p className="text-neutral-400 font-bold text-xs lg:text-sm">{item?.name.split(" ")[1]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <CardCarousel
          data={similarData}
          heading={"Similar " + params?.explore + (params?.explore === 'tv' ? " Shows" : "s")}
          trending={false}
          media_type={params?.explore}
        />
      </div>

      <div>
        <CardCarousel
          data={recommendationsData}
          heading={"Recommended " + params?.explore + (params?.explore === 'tv' ? " Shows" : "s")}
          trending={false}
          media_type={params?.explore}
        />
      </div>

      {playVideo && <VideoPlay playVideoId={params?.id} media_type={params?.explore} close={() => setPlayVideo(false)} />}
    </div>
  );
};

export default DetailsPage;
