import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/Reusables/ErrorBoundary";
import Footer from "./components/Reusables/Footer";
import Header from "./components/Reusables/Header";
import MobileBottomNav from "./components/Reusables/MobileBottomNav";
import { Analytics } from "@vercel/analytics/react"

const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname, location.search]);

  const hideFooterPaths = ["/tv", "/movie", "/watchlist", "/downloads", "/settings"];
  const isSearchPath = location.pathname === "/search" && location.search.includes("q=");

  const shouldHideFooter = hideFooterPaths.includes(location.pathname) || isSearchPath;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 liquid-bg" aria-hidden />
      <div className="pointer-events-none fixed -top-32 -left-32 h-96 w-96 rounded-full bg-accent/25 blur-[120px] -z-10" aria-hidden />
      <div className="pointer-events-none fixed top-1/3 -right-32 h-80 w-80 rounded-full bg-accent-purple/20 blur-[100px] -z-10" aria-hidden />
      <div className="pointer-events-none fixed -bottom-32 left-1/3 h-72 w-72 rounded-full bg-tertiary/15 blur-[100px] -z-10" aria-hidden />

      <Header />
      <MobileBottomNav />
      <div className="flex min-h-dvh flex-col text-text pb-[calc(3.0625rem+env(safe-area-inset-bottom))] md:pb-0">
        <main className="relative flex flex-1 flex-col overflow-x-hidden">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        {!shouldHideFooter && <Footer />}
      </div>
      <Analytics />
    </>
  );
};

export default App;
