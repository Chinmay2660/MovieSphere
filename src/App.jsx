import { Outlet } from "react-router-dom"
import Footer from "./components/Reusables/Footer"
import Header2 from "./components/Reusables/Header2"
import MobileNavigation from "./components/MobileNavigation"

const App = () => {
  return (
    <main className="pb-14 lg:pb-0">
      <Header2 />
      <div className="pt-16">
        <Outlet />
      </div>
      <Footer />
      <MobileNavigation/>
    </main>
  )
}

export default App