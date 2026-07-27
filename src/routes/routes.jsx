import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const Home = lazy(() => import("../pages/Home"));
const ExplorePage = lazy(() => import("../pages/ExplorePage"));
const DetailsPage = lazy(() => import("../pages/DetailsPage"));
const SearchPage = lazy(() => import("../pages/SearchPage"));
const WatchlistPage = lazy(() => import("../pages/WatchlistPage"));
const DownloadsPage = lazy(() => import("../pages/DownloadsPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const NotFound = lazy(() => import("../components/Reusables/ErrorPage"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <LandingPage />,
            },
            {
                path: "/home",
                element: <Home />,
            },
            {
                path: ":explore",
                element: <ExplorePage />,
            },
            {
                path: ":explore/:id",
                element: <DetailsPage />,
            },
            {
                path: "/search",
                element: <SearchPage />,
            },
            {
                path: "/watchlist",
                element: <WatchlistPage />,
            },
            {
                path: "/downloads",
                element: <DownloadsPage />,
            },
            {
                path: "/settings",
                element: <SettingsPage />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ]
    },
]);

export default router;
