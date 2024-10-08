import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { IoPlay, IoInformationCircleOutline, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import VideoPlay from "../VideoPlay";

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const bannerData = useSelector((state) => state.movieData.bannerData);
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const [playVideo, setPlayVideo] = useState(false);
  const [playVideoData, setPlayVideoData] = useState();
  const navigate = useNavigate();

  const handlePrevClick = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, []);

  const handleNextClick = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, bannerData.length - 1));
  }, [bannerData.length]);

  const handleVideoPlay = useCallback((data) => {
    setPlayVideoData(data);
    setPlayVideo(true);
  }, []);

  useEffect(() => {
    if (!playVideo) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex === bannerData.length - 1 ? 0 : prevIndex + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [bannerData.length, playVideo]);

  return (
    <section className="relative top-0 w-full h-screen group overflow-hidden">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {bannerData?.map((data, index) => (
          <div key={index} className="relative w-full h-screen flex-shrink-0">
            <img
              src={imageURL + data?.backdrop_path}
              alt={`Banner ${index}`}
              className="absolute inset-0 h-full w-full object-cover"
              width={1000}
              height={500}
              loading="lazy"
              srcSet={`${imageURL + data?.backdrop_path} 1x, ${imageURL + data?.backdrop_path} 2x`}
              style={{ aspectRatio: '2/1' }}
            />
            <div className="absolute top-0 w-full h-full bg-gradient-to-t from-background to-transparent"></div>
            <div className="absolute bottom-20 left-8 lg:left-16 max-w-md p-4">
              <h2 className="text-2xl font-bold lg:text-4xl text-white drop-shadow-2xl">
                {data?.title ? data?.title : data?.original_title ? data?.original_title : data?.name}
              </h2>
              <p className="text-ellipsis line-clamp-3 my-2 text-white drop-shadow-lg">{data?.overview}</p>
              <div className="flex items-center gap-4">
                {data?.vote_average && data?.vote_average > 0 && <p>Rating: {Number(data?.vote_average).toFixed(1)}+</p>}
                {data?.popularity && data?.popularity > 0 && <span>|</span>}
                {data?.popularity && data?.popularity > 0 && <p>Views: {Number(data?.popularity).toFixed(0)}+</p>}
              </div>
              <div className="flex flex-wrap gap-6 mt-8">
                <button
                  onClick={() => handleVideoPlay(data)}
                  className="flex items-center gap-2 justify-center w-[12rem] lg:w-[12rem] py-3 px-6 text-center text-black text-base font-bold bg-text hover:bg-secondary active:shadow-none rounded-lg shadow"
                >
                  <IoPlay className="w-6 h-6 transition-colors duration-300" />
                  <span>Play Now</span>
                </button>
                <button
                  onClick={() => navigate("/" + data?.media_type + "/" + data?.id)}
                  className="flex items-center gap-2 justify-center w-[12rem] lg:w-[12rem] py-3 px-6 text-center text-white text-base font-bold bg-black hover:bg-secondary active:shadow-none rounded-lg shadow"
                >
                  <IoInformationCircleOutline className="w-6 h-6 text-blue-500 transition-colors duration-300" />
                  <span>More Details</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {currentIndex > 0 && (
        <button
          onClick={handlePrevClick}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300 hidden group-hover:lg:flex"
          aria-label="Previous slide"
        >
          <IoChevronBack className="w-6 h-6 hover:scale-125 transition-transform duration-300" />
        </button>
      )}
      {currentIndex < bannerData?.length - 1 && (
        <button
          onClick={handleNextClick}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300 hidden group-hover:lg:flex"
          aria-label="Next slide"
        >
          <IoChevronForward className="w-6 h-6 hover:scale-125 transition-transform duration-300" />
        </button>
      )}

      {playVideo && <VideoPlay playVideoId={playVideoData?.id} media_type={playVideoData?.media_type} close={() => setPlayVideo(false)} />}
    </section>
  );
};

export default Banner;
