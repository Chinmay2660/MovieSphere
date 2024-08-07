import { useParams } from "react-router-dom";
import axiosInstance from "../lib/axiosConfig";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImageURL } from "../reduxStore/Reducer/movieSlice";
import moment from "moment";
import Divider from "../components/Reusables/Divider";

const DetailsPage = () => {
  const params = useParams();
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const [data, setData] = useState();
  const [castData, setCastData] = useState();
  const [similarData, setSimilarData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch()

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [detailsResponse, castResponse, similarResponse] = await Promise.all([
        axiosInstance.get(`/${params?.explore}/${params?.id}`),
        axiosInstance.get(`/${params?.explore}/${params?.id}/credits`),
        axiosInstance.get(`/${params?.explore}/${params?.id}/similar`)
      ]);
      setData(detailsResponse.data);
      setCastData(castResponse.data);
      setSimilarData(similarResponse.data);
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
  }, [params, imageURL]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const duration = (Number(data?.runtime) / 60).toFixed(1).split(".")

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
        <div className="absolute w-full h-full top-0 bg-radient-to-t from-neutral-900/90 to-transparent"></div>
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
            <span>|</span>
            {data?.vote_count && <p className="text-tertiary mt-1">Views: {Number(data?.vote_count)}+</p>}
            <span>|</span>
            {data?.runtime && <p className="text-tertiary mt-1">Duration: {duration[0]}h {duration[1]}m</p>}
          </div>

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
              <p><span className=" text-white">Direction</span> : {castData?.crew?.find((item) => item?.job === "Director")?.name}</p>
              <Divider />
              <p><span className=" text-white">Writer</span> : {castData?.crew?.filter((item) => item?.job === "Writer").map((item) => item?.name).join(", ")}</p>
              <Divider />
            </div>

            <Divider />

            <h2 className="text-lg mb-3 text-white">Cast :</h2>
            <div className="grid grid-cols-[repeat(auto-fit,96px)] gap-5">
              {castData?.cast?.filter((item) => item?.profile_path).map((item, index) => (
                <div key={index} className="flex flex-col items-center justify-center">
                  <div className="">
                    <img
                      src={imageURL + item?.profile_path}
                      alt={`Banner`}
                      className="h-24 w-24 object-cover rounded-full"
                      loading="lazy"
                    />
                    <p className="text-neutral-400 font-bold text-center text-sm ">{item?.name}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default DetailsPage;