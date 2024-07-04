import { useSelector } from "react-redux"
import { IoPlay, IoInformationCircleOutline } from "react-icons/io5";

const Banner = () => {
  const bannerData = useSelector(state => state.movieData.bannerData)
  const imageURL = useSelector(state => state.movieData.imageURL)

  console.log(bannerData)
  return (
    <section className="relative top-0 w-full h-screen">
      <div className="flex min-h-full max-h-full">
        {
          bannerData.map((data, index) => (
            <div key={index} className="relative min-w-full min-h-full overflow-hidden">
              <img
                src={imageURL + data.backdrop_path}
                alt={`Banner ${index}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-0 w-full h-full bg-gradient-to-t from-neutral-900 to-transparent"></div>
              <div className="absolute bottom-20 left-8 lg:left-16 max-w-md p-4">
                <h2 className="text-2xl font-bold lg:text-4xl text-white drop-shadow-2xl">{data?.title ? data?.title : data?.original_title ? data?.original_title : data?.name}</h2>
                <p className="text-ellipsis line-clamp-3 my-2 text-white drop-shadow-lg">{data?.overview}</p>
                <div className="flex items-center gap-4">
                  <p>Rating: {Number(data.vote_average).toFixed(1)}+</p>
                  <span>|</span>
                  <p>View: {Number(data.popularity).toFixed(0)}</p>
                </div>
                <div className="flex flex-wrap gap-6 mt-8">
                  <button href="/home" className="flex items-center gap-2 py-3 px-6 text-center text-black text-base font-bold bg-text hover:bg-secondary active:shadow-none rounded-lg shadow">
                    <IoPlay className="w-6 h-6" />
                    <span>Play Now</span>
                  </button>
                  <button href="/home" className="flex items-center gap-2 py-3 px-6 text-center text-white text-base font-bold bg-black hover:bg-secondary active:shadow-none rounded-lg shadow">
                    <IoInformationCircleOutline className="w-6 h-6" />
                    <span>More Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </section>
  )
}

export default Banner