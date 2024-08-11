import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import axiosInstance from "../lib/axiosConfig";
import { setImageURL } from "../reduxStore/Reducer/movieSlice";
import { useDispatch } from "react-redux";
import Card from "../components/Home/Card";

const SearchPage = () => {
  const location = useLocation()
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/search/multi`, {
        params: {
          query: location?.search?.slice(3),
          page: pageNo,
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

  const debouncedFetchData = debounce(fetchData, 500);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
      if (pageNo < totalPageNo) {
        setPageNo((prev) => prev + 1);
      }
    }
  };

  const fetchConfigurationData = async () => {
    try {
      const response = await axiosInstance.get('/configuration')
      dispatch(setImageURL(response.data.images.secure_base_url + "original"))
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() => {
    fetchConfigurationData();
    debouncedFetchData();
  }, [pageNo]);

  useEffect(() => {
    if (location?.search?.slice(3)) {
      setPageNo(1);
      setData([]);
      debouncedFetchData();
    }
  }, [location?.search]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pageNo, loading]);

  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="capitalize text-2xl font-bold my-4 text-center lg:text-left mt-10 mb-10">
          Search Results for {location?.search?.slice(3)?.split("%20").join(" ")}
        </h3>

        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {data.map((item) => (
            <div key={item.id + "search"} className="flex justify-center items-center">
              <Card data={item} trending={false} media_type={item.media_type} />
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
  )
}

export default SearchPage