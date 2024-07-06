import { useSelector } from 'react-redux';
import Banner from '../components/Home/Banner';
import CardCarousel from '../components/Home/CardCarousel';

const Home = () => {
  const trendingData = useSelector((state) => state.movieData.bannerData);

  return (
    <div className="relative w-full h-screen">
      <Banner />
      <CardCarousel data={trendingData} heading={"Trending Now"}/>
    </div>
  );
};

export default Home;