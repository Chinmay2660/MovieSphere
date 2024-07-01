import { Outlet } from "react-router-dom"
import Footer from "./components/Reusables/Footer"
import Header2 from "./components/Reusables/Header2"
import MobileNavigation from "./components/MobileNavigation"
import axiosInstance from './utils/axiosConfig'
import { useEffect } from "react"

const App = () => {
  const fetchTrendingData = async () => {
    try {
      const response = await await axiosInstance.get('/trending/all/week')
      console.log(response, "reponse")
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() =>{
    fetchTrendingData()
  },[])
  return (
    <main className="pb-14 lg:pb-0">
      <Header2 />
      <div className="pt-16">
        <Outlet />
      </div>
      <Footer />
      <MobileNavigation />
    </main>
  )
}

export default App