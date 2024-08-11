import { useParams } from "react-router-dom";
import axiosInstance from "../lib/axiosConfig";
import { useEffect, useState, useCallback } from "react";
import Card from "../components/Home/Card";
import { setImageURL } from "../reduxStore/Reducer/movieSlice";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "../lib/utils";

const ExplorePage = () => {
  const params = useParams();
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const imageURL = useSelector((state) => state.movieData.imageURL);

  const fetchData = async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/discover/${params.explore}`, {
        params: {
          page: currentPage,
        },
      });
      setData((prev) => [...prev, ...response.data.results]);
      setTotalPageNo(response.data.total_pages);
    } catch (error) {
      setError("Failed to fetch data");
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback(
    debounce(() => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        if (pageNo < totalPageNo) {
          setPageNo((prev) => prev + 1);
        }
      }
    }, 700),
    [pageNo, totalPageNo, loading]
  );

  const fetchConfigurationData = async () => {
    try {
      const response = await axiosInstance.get('/configuration');
      dispatch(setImageURL(response.data.images.secure_base_url + "original"));
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!imageURL) {
      fetchConfigurationData();
    }
  }, [imageURL]);

  useEffect(() => {
    if (pageNo !== 1) {
      fetchData(pageNo);
    }
  }, [pageNo]);

  useEffect(() => {
    setPageNo(1);
    setData([]);
    fetchData(1);
  }, [params.explore]);

  useEffect(() => {
    setLoading(true);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const getHeading = () => {
    const type = params.explore === 'tv' ? "TV Shows" : "Movies";
    return `Popular ${type}`;
  };

  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="capitalize text-2xl font-bold my-4 text-center lg:text-left mt-10 mb-10">
          {getHeading()}
        </h3>

        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {data.map((item) => (
            <div key={item.id + "explore"} className="flex justify-center items-center">
              <Card data={item} trending={false} media_type={params.explore} />
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center my-4 mt-10 mb-10">
            <span>Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;