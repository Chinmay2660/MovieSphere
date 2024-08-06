import { useParams } from "react-router-dom";
import axiosInstance from "../lib/axiosConfig";
import { useEffect, useState } from "react";

const DetailsPage = () => {
  const params = useParams();
  const [data, setData] = useState();
  const [castData, setCastData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/${params?.explore}/${params?.id}`);
      setData(response.data);
    } catch (error) {
      setError("Failed to fetch data");
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCastData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/${params?.explore}/${params?.id}/credits`);
      setCastData(response.data);
    } catch (error) {
      setError("Failed to fetch data");
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCastData();
  }, [params]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div>DetailsPage {data.name}</div>
    </div>
  );
};

export default DetailsPage;