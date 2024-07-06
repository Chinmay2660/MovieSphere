import { useSelector } from 'react-redux';
import Banner from '../components/Home/Banner';
import Card from '../components/Home/Card';

const Home = () => {
  const trendingData = useSelector((state) => state.movieData.bannerData);

  return (
    <div className="relative w-full h-screen">
      <Banner />
      <div className="container mx-auto px-3 my-10">
        <h2 className="text-xl font-bold lg:text-2xl mb-2">Trending</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
          {trendingData.map((data, index) => (
            <Card key={data.id} data={data} index={index + 1} trending={true}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;