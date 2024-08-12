import { Outlet } from "react-router-dom";
import Footer from "./components/Reusables/Footer";
import Header from "./components/Reusables/Header";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default App