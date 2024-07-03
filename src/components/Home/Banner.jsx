import { useSelector } from "react-redux"

const Banner = () => {
  const bannerData = useSelector(state => state.movieData.bannerData)
  const imageURL = useSelector(state => state.movieData.imageURL)

  console.log(bannerData)
  return (
    <section className="w-full h-full mt-0">
      <div className="flex min-h-full max-h-[95vh]">
        {
          bannerData.map((data, index) => {
            return (
              <div key={index} className="min-w-full min-h-[450px] lg:min-h-full overflow-hidden relative">
                <div className="w-full h-full">
                  <img src={imageURL + data.backdrop_path} className="h-full w-full object-cover"/>
                </div>
              </div>
            )
          })
        }
      </div>
    </section>
  )
}

export default Banner