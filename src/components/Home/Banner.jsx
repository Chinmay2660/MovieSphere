import { useState } from "react";
import { useSelector } from "react-redux";
import { IoPlay, IoInformationCircleOutline, IoChevronBack, IoChevronForward } from "react-icons/io5";

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const bannerData = useSelector((state) => state.movieData.bannerData);
  const imageURL = useSelector((state) => state.movieData.imageURL);

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentIndex < bannerData.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  console.log(bannerData);
  return (
    <section className="relative top-0 w-full h-screen group">
      <div
        className="flex min-h-full max-h-full transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {bannerData.map((data, index) => (
          <div
            key={index}
            className="relative min-w-full min-h-full overflow-hidden"
          >
            <img
              src={imageURL + data.backdrop_path}
              alt={`Banner ${index}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute top-0 w-full h-full bg-gradient-to-t from-neutral-900 to-transparent"></div>
            <div className="absolute bottom-20 left-8 lg:left-16 max-w-md p-4">
              <h2 className="text-2xl font-bold lg:text-4xl text-white drop-shadow-2xl">
                {data?.title ? data?.title : data?.original_title ? data?.original_title : data?.name}
              </h2>
              <p className="text-ellipsis line-clamp-3 my-2 text-white drop-shadow-lg">{data?.overview}</p>
              <div className="flex items-center gap-4">
                <p>Rating: {Number(data.vote_average).toFixed(1)}+</p>
                <span>|</span>
                <p>View: {Number(data.popularity).toFixed(0)}</p>
              </div>
              <div className="flex flex-wrap gap-6 mt-8">
                <button
                  href="/home"
                  className="flex items-center gap-2 py-3 px-6 text-center text-black text-base font-bold bg-text hover:bg-secondary active:shadow-none rounded-lg shadow group"
                >
                  <IoPlay className="w-6 h-6 group-hover:text-yellow-500 transition-colors duration-300" />
                  <span>Play Now</span>
                </button>
                <button
                  href="/home"
                  className="flex items-center gap-2 py-3 px-6 text-center text-white text-base font-bold bg-black hover:bg-secondary active:shadow-none rounded-lg shadow group"
                >
                  <IoInformationCircleOutline className="w-6 h-6 group-hover:text-blue-500 transition-colors duration-300" />
                  <span>More Details</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handlePrevClick}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300 hidden group-hover:lg:flex"
      >
        <IoChevronBack className="w-6 h-6 hover:scale-125 transition-transform duration-300" />
      </button>
      <button
        onClick={handleNextClick}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300 hidden group-hover:lg:flex"
      >
        <IoChevronForward className="w-6 h-6 hover:scale-125 transition-transform duration-300" />
      </button>
    </section>
  );
};

export default Banner;
