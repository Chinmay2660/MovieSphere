import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/Reusables/ErrorBoundary";
import Footer from "./components/Reusables/Footer";
import Header from "./components/Reusables/Header";
import Loader from "./components/Reusables/Loader";
import MobileBottomNav from "./components/Reusables/MobileBottomNav";
import { Analytics } from "@vercel/analytics/react"
import { scrollAppToTop } from "./lib/scrollToTop";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    scrollAppToTop();
  }, [location.pathname, location.search]);

  const hideFooterPaths = ["/tv", "/movie", "/watchlist", "/downloads", "/settings"];
  const shouldHideFooter =
    hideFooterPaths.includes(location.pathname) || location.pathname === "/search";

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 liquid-bg" aria-hidden />
      <div className="pointer-events-none fixed -top-32 -left-32 h-96 w-96 rounded-full bg-accent/25 blur-[120px] -z-10" aria-hidden />
      <div className="pointer-events-none fixed top-1/3 -right-32 h-80 w-80 rounded-full bg-accent-purple/20 blur-[100px] -z-10" aria-hidden />
      <div className="pointer-events-none fixed -bottom-32 left-1/3 h-72 w-72 rounded-full bg-tertiary/15 blur-[100px] -z-10" aria-hidden />

      <Header />
      <MobileBottomNav />
      <div className="app-shell text-text pb-[calc(3.8125rem+env(safe-area-inset-bottom))] md:pb-0">
        <main className="app-main">
          <ErrorBoundary>
            <Suspense fallback={<Loader size="lg" className="min-h-[50vh]" />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
        {!shouldHideFooter && <Footer />}
      </div>
      <Analytics />
    </>
  );
};

export default App;
