import { Outlet } from "react-router-dom";
// import Footer from "./components/Reusables/Footer"
import Header from "./components/Reusables/Header";

const App = () => {
  return (
    <main className="pb-14 lg:pb-0">
      <Header />
      <div>
        <Outlet />
      </div>
    </main>
  )
}

export default App