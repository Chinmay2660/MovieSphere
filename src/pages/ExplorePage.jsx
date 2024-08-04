import { useParams } from "react-router-dom";
import axiosInstance from "../lib/axiosConfig";
import { useEffect, useState } from "react";
import Card from "../components/Home/Card";
import { setImageURL } from "../reduxStore/Reducer/movieSlice";
import { useDispatch } from "react-redux";

const ExplorePage = () => {
  const params = useParams();
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch()

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/discover/${params.explore}`, {
        params: {
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
    fetchConfigurationData()
    fetchData();
  }, [pageNo]);

  useEffect(() => {
    setPageNo(1)
    setData([])
    fetchData()
  }, [params.explore])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pageNo, loading]);

  return (
    <div className="pt-16">
      <div className="container mx-auto">
        <h3 className="capitalize text-2xl font-bold my-2">
          Popular {params.explore}
        </h3>

        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center mb-4">
            <span>Loading...</span>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fit,230px)] gap-6">
          {data.map((item) => {
            return (
              <Card key={item.id + "explore"} data={item} trending={false} media_type={params.explore} />
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
