import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LandingPage from "../pages/LandingPage";
import DetailsPage from "../pages/DetailsPage";
import ExplorePage from "../pages/ExplorePage";
import SearchPage from '../pages/SearchPage'
import Home from "../pages/Home";

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
        ]
    },
]);

export default router