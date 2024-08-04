import { Outlet } from "react-router-dom";
// import Footer from "./components/Reusables/Footer"
import Header from "./components/Reusables/Header";
import MobileNavigation from "./components/MobileNavigation";

const App = () => {
  return (
    <main className="pb-14 lg:pb-0">
      <Header />
      <div>
        <Outlet />
      </div>
      <MobileNavigation />
    </main>
  )
}

export default App