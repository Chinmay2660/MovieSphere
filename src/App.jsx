import { Outlet, useLocation } from "react-router-dom";
import Footer from "./components/Reusables/Footer";
import Header from "./components/Reusables/Header";
import { Analytics } from "@vercel/analytics/react"

const App = () => {
  const location = useLocation();

  const hideFooterPaths = ["/tv", "/movie"];
  const isSearchPath = location.pathname === "/search" && location.search.includes("q=");

  const shouldHideFooter = hideFooterPaths.includes(location.pathname) || isSearchPath;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      {!shouldHideFooter && <Footer />}
      <Analytics />
    </div>
  );
};

export default App;
