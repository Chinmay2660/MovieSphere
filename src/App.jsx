import { Outlet } from "react-router-dom"
// import Footer from "./components/Reusables/Footer"
import Header from "./components/Reusables/Header"
import MobileNavigation from "./components/MobileNavigation"
import axiosInstance from './lib/axiosConfig'
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setBannerData, setImageURL, setNowPlayingData, setTopRatedData, setUpcomingData } from "./reduxStore/Reducer/movieSlice"

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trendingResponse,
          upcomingResponse,
          topRatedResponse,
          nowPlayingResponse,
          configResponse
        ] = await Promise.all([
          axiosInstance.get('/trending/all/week'),
          axiosInstance.get('/movie/upcoming'),
          axiosInstance.get('/movie/top_rated'),
          axiosInstance.get('/movie/now_playing'),
          axiosInstance.get('/configuration'),
        ]);

        dispatch(setBannerData(trendingResponse.data.results));
        dispatch(setUpcomingData(upcomingResponse.data.results));
        dispatch(setTopRatedData(topRatedResponse.data.results));
        dispatch(setNowPlayingData(nowPlayingResponse.data.results));
        dispatch(setImageURL(configResponse.data.images.secure_base_url + "original"));
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <main className="pb-14 lg:pb-0">
      <Header />
      <div>
        <Outlet />
      </div>
      <MobileNavigation />
    </main>
  )
}

export default App