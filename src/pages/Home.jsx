import { useSelector } from 'react-redux';
import Banner from '../components/Home/Banner';
import CardCarousel from '../components/Home/CardCarousel';

const Home = () => {
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
