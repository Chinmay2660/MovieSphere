import { Outlet } from "react-router-dom"
// import Footer from "./components/Reusables/Footer"
import Header from "./components/Reusables/Header"
import MobileNavigation from "./components/MobileNavigation"
import axiosInstance from './lib/axiosConfig'
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setBannerData, setImageURL, setNowPlayingData, setTopRatedData, setUpcomingData } from "./reduxStore/Reducer/movieSlice"

const App = () => {
  const dispatch = useDispatch()
  const fetchTrendingData = async () => {
    try {
      const response = await axiosInstance.get('/trending/all/week')
      dispatch(setBannerData(response.data.results))
      console.log(response.data.results)
    } catch (error) {
      console.log("error", error)
    }
  }

  const fetchUpcomingData = async () => {
    try {
      const response = await axiosInstance.get('/movie/upcoming')
      dispatch(setUpcomingData(response.data.results))
      console.log(response.data.results)
    } catch (error) {
      console.log("error", error)
    }
  }

  const fetchTopRatedData = async () => {
    try {
      const response = await axiosInstance.get('/movie/top_rated')
      dispatch(setTopRatedData(response.data.results))
      console.log(response.data.results)
    } catch (error) {
      console.log("error", error)
    }
  }

  const fetchNowPlayingData = async () => {
    try {
      const response = await axiosInstance.get('/movie/now_playing')
      dispatch(setNowPlayingData(response.data.results))
      console.log(response.data.results)
    } catch (error) {
      console.log("error", error)
    }
  }

  const fetchConfigurationData = async () => {
    try {
      const response = await axiosInstance.get('/configuration')
      dispatch(setImageURL(response.data.images.secure_base_url + "original"))
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() => {
    fetchTrendingData()
    fetchUpcomingData()
    fetchTopRatedData()
    fetchNowPlayingData()
    fetchConfigurationData()
  }, [])

  return (
    <main className="pb-14 lg:pb-0">
      <Header />
      <div>
        <Outlet />
      </div>
      {/* <Footer /> */}
      <MobileNavigation />
    </main>
  )
}

export default App