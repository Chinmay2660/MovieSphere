import { Outlet } from "react-router-dom"
import Footer from "./components/Reusables/Footer"
import Header from "./components/Reusables/Header"
import MobileNavigation from "./components/MobileNavigation"
import axiosInstance from './lib/axiosConfig'
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setBannerData } from "./reduxStore/Reducer/movieSlice"

const App = () => {
  const dispatch = useDispatch()
  const fetchTrendingData = async () => {
    try {
      const response = await await axiosInstance.get('/trending/all/week')
      dispatch(setBannerData(response.data.results))
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() => {
    fetchTrendingData()
  }, [])

  return (
    <main className="pb-14 lg:pb-0">
      <Header />
      <div className="pt-16">
        <Outlet />
      </div>
      <Footer />
      <MobileNavigation />
    </main>
  )
}

export default App