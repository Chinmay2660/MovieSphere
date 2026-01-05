import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../lib/axiosConfig';
import {
  setBannerData,
  setImageURL,
  setNowPlayingData,
  setPopularTvData,
  setUpcomingData,
  setTopRatedMovies,
  setTopRatedTv,
  setTrendingMovies,
  setTrendingTv,
  setAiringToday,
  setOnTheAir
} from '../reduxStore/Reducer/movieSlice';
import Banner from '../components/Home/Banner';
import CardCarousel from '../components/Home/CardCarousel';

const Home = () => {
  const dispatch = useDispatch();

  const trendingData = useSelector((state) => state.movieData.bannerData);
  const upcomingData = useSelector((state) => state.movieData.upcomingData);
  const popularTvData = useSelector((state) => state.movieData.popularTvData);
  const nowPlayingData = useSelector((state) => state.movieData.nowPlayingData);
  const topRatedMovies = useSelector((state) => state.movieData.topRatedMovies);
  const topRatedTv = useSelector((state) => state.movieData.topRatedTv);
  const trendingMovies = useSelector((state) => state.movieData.trendingMovies);
  const trendingTv = useSelector((state) => state.movieData.trendingTv);
  const airingToday = useSelector((state) => state.movieData.airingToday);
  const onTheAir = useSelector((state) => state.movieData.onTheAir);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = [];
        const handlers = [];

        // Trending All
        if (!trendingData.length) {
          requests.push(axiosInstance.get('/trending/all/week'));
          handlers.push((data) => dispatch(setBannerData(data.results)));
        }

        // Upcoming Movies
        if (!upcomingData.length) {
          requests.push(axiosInstance.get('/movie/upcoming'));
          handlers.push((data) => dispatch(setUpcomingData(data.results)));
        }

        // Popular TV
        if (!popularTvData.length) {
          requests.push(axiosInstance.get('/tv/popular'));
          handlers.push((data) => dispatch(setPopularTvData(data.results)));
        }

        // Now Playing
        if (!nowPlayingData.length) {
          requests.push(axiosInstance.get('/movie/now_playing'));
          handlers.push((data) => dispatch(setNowPlayingData(data.results)));
        }

        // Top Rated Movies
        if (!topRatedMovies.length) {
          requests.push(axiosInstance.get('/movie/top_rated'));
          handlers.push((data) => dispatch(setTopRatedMovies(data.results)));
        }

        // Top Rated TV
        if (!topRatedTv.length) {
          requests.push(axiosInstance.get('/tv/top_rated'));
          handlers.push((data) => dispatch(setTopRatedTv(data.results)));
        }

        // Trending Movies
        if (!trendingMovies.length) {
          requests.push(axiosInstance.get('/trending/movie/week'));
          handlers.push((data) => dispatch(setTrendingMovies(data.results)));
        }

        // Trending TV
        if (!trendingTv.length) {
          requests.push(axiosInstance.get('/trending/tv/week'));
          handlers.push((data) => dispatch(setTrendingTv(data.results)));
        }

        // Airing Today
        if (!airingToday.length) {
          requests.push(axiosInstance.get('/tv/airing_today'));
          handlers.push((data) => dispatch(setAiringToday(data.results)));
        }

        // On The Air
        if (!onTheAir.length) {
          requests.push(axiosInstance.get('/tv/on_the_air'));
          handlers.push((data) => dispatch(setOnTheAir(data.results)));
        }

        // Configuration
        requests.push(axiosInstance.get('/configuration'));

        const responses = await Promise.all(requests);

        // Process responses
        responses.forEach((response, index) => {
          if (index < handlers.length) {
            handlers[index](response.data);
          }
        });

        // Set image URL from config (last response)
        const configResponse = responses[responses.length - 1];
        dispatch(setImageURL(configResponse.data.images.secure_base_url + "original"));

      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const carousels = [
    { heading: "🔥 Trending Now", data: trendingData, trending: true },
    { heading: "🎬 Now Playing in Theaters", data: nowPlayingData, trending: false, media_type: "movie" },
    { heading: "📺 Popular TV Shows", data: popularTvData, trending: false, media_type: "tv" },
    { heading: "🌟 Top Rated Movies", data: topRatedMovies, trending: false, media_type: "movie" },
    { heading: "📡 Airing Today", data: airingToday, trending: false, media_type: "tv" },
    { heading: "🎥 Trending Movies", data: trendingMovies, trending: true, media_type: "movie" },
    { heading: "📺 Trending TV Shows", data: trendingTv, trending: true, media_type: "tv" },
    { heading: "⭐ Top Rated TV Shows", data: topRatedTv, trending: false, media_type: "tv" },
    { heading: "🎞️ Upcoming Movies", data: upcomingData, trending: false, media_type: "movie" },
    { heading: "📻 On The Air", data: onTheAir, trending: false, media_type: "tv" },
  ].filter(carousel => carousel.data && carousel.data.length > 0);

  return (
    <div className="relative w-full min-h-screen">
      <Banner />
      <div className="space-y-2">
        {carousels.map((carousel, index) => (
          <CardCarousel
            key={index}
            data={carousel.data}
            heading={carousel.heading}
            trending={carousel.trending}
            media_type={carousel.media_type}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
