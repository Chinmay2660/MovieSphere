import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../lib/axiosConfig';
import {
  setBannerData,
  setImageURL,
  setNowPlayingData,
  setTopRatedData,
  setUpcomingData
} from '../reduxStore/Reducer/movieSlice';
import Banner from '../components/Home/Banner';
import CardCarousel from '../components/Home/CardCarousel';

const Home = () => {
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

  const trendingData = useSelector((state) => state.movieData.bannerData);
  const upcomingData = useSelector((state) => state.movieData.upcomingData);
  const topRatedData = useSelector((state) => state.movieData.topRatedData);
  const nowPlayingData = useSelector((state) => state.movieData.nowPlayingData);

  const carousels = [
    { heading: "Trending Now", data: trendingData, trending: true },
    { heading: "Upcoming Movies", data: upcomingData, trending: false },
    { heading: "Top Rated Movies", data: topRatedData, trending: false },
    { heading: "Now Playing", data: nowPlayingData, trending: false }
  ];

  return (
    <div className="relative w-full h-screen">
      <Banner />
      {carousels.map((carousel, index) => (
        <CardCarousel
          key={index}
          data={carousel.data}
          heading={carousel.heading}
          trending={carousel.trending}
        />
      ))}
    </div>
  );
};

export default Home;
