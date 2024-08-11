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
  const [recommendtionsData, setRecommendationsData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playVideo, setPlayVideo] = useState(false)
  const dispatch = useDispatch()

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
      const response = await axiosInstance.get('/configuration')
      dispatch(setImageURL(response?.data?.images?.secure_base_url + "original"))
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() => {
    if (imageURL !== undefined) {
      fetchConfigurationData()
    }
    fetchData();
  }, [params]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const duration = (Number(data?.runtime) / 60).toFixed(1).split(".")

  const directorName = castData?.crew?.filter((item) => item?.job === "Director").map((item) => item?.name).join(", ")

  const writerName = castData?.crew?.filter((item) => item?.job === "Writer").map((item) => item?.name).join(", ")

  return (
    <div>
      <div className='w-full h-[300px] relative hidden lg:block'>
        <div className="w-full h-full">
          <img
            src={imageURL + data?.backdrop_path}
            alt={`Banner`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute w-full h-full top-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-100"></div>
      </div>

      <div className="container mx-auto px-3 py-16 lg:py-0 flex flex-col lg:flex-row gap-5 lg:gap-10">
        <div className=" relative mx-auto lg:-mt-40 lg:mx-0 w-fit">
          <img
            src={imageURL + data?.poster_path}
            alt={`Banner`}
            className="h-80 w-60 object-cover rounded min-w-60"
            loading="lazy"
          />
        </div>

        <div >
          <h2 className="text-2xl lg:text-3xl font-bold text-white">{data.title ?? data.original_title ?? data.name}</h2>
          <p className="text-neutral-400 mt-1 ">{data.tagline}</p>

          <Divider />

          <div className="flex items-center gap-3">
            {data?.vote_average && <p className="text-tertiary mt-1">Rating: {Number(data?.vote_average).toFixed(1)}+</p>}
            {data?.vote_count && <span>|</span>}
            {data?.vote_count && <p className="text-tertiary mt-1">Views: {Number(data?.vote_count)}+</p>}
            {data?.runtime && <span>|</span>}
            {data?.runtime && <p className="text-tertiary mt-1">Duration: {duration[0]}h {duration[1]}m</p>}
          </div>

          <Divider />

          <button
            onClick={() => setPlayVideo(true)}
            className="flex items-center gap-2 py-3 px-6 text-center text-black text-base font-bold bg-text hover:bg-secondary active:shadow-none rounded-lg shadow"
          >
            <IoPlay className="w-6 h-6  transition-colors duration-300" />
            <span>Play Now</span>
          </button>

          <Divider />

          <div>
            <h3 className="text-white font-bold text-xl">Overview</h3>
            <p >{data?.overview}</p>

            <Divider />

            <div className="flex items-center my-2 gap-3">
              <p className="text-white mt-1">Status: {data?.status}</p>
              <span>|</span>
              <p className="text-white mt-1">
                Release Date : {moment(data?.release_date ? data?.release_date : data?.first_air_date).format("MMMM Do YYYY")}
              </p>
            </div>

            <Divider />

            <div>
              {directorName && <p><span className=" text-white">Direction</span> : {directorName}</p>}
              {directorName && <Divider />}
              {writerName && <p><span className=" text-white">Writer</span> : {writerName}</p>}
              {writerName && <Divider />}
            </div>

            <Divider />

            <h2 className="text-lg mb-3 text-white">Cast :</h2>
            <div className="grid grid-cols-[repeat(auto-fit,96px)] gap-5">
              {castData?.cast?.filter((item) => item?.profile_path).map((item, index) => (
                <div key={index} className="flex flex-col items-center justify-start">
                  <div>
                    <img
                      src={imageURL + item?.profile_path}
                      alt={`Banner`}
                      className="h-24 w-24 object-cover rounded-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-center mt-2 leading-tight">
                    <p className="text-neutral-400 font-bold text-sm max-w-full break-words">
                      {item?.name.split(" ")[0]}
                    </p>
                    <p className="text-neutral-400 font-bold text-sm max-w-full break-words">
                      {item?.name.split(" ")[1]}
                    </p>
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
          data={recommendtionsData}
          heading={"Recommendation " + params?.explore + (params?.explore === 'tv' ? " Shows" : "s")}
          trending={false}
          media_type={params?.explore}
        />
      </div>

      {playVideo && <VideoPlay playVideoId={params?.id} media_type={params?.explore} close={() => setPlayVideo(false)} />}
    </div>
  );
};

export default DetailsPage;