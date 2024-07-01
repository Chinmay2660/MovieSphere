import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LandingPage from "../pages/LandingPage";
import DetailsPage from "../pages/DetailsPage";
import ExplorePage from "../pages/ExplorePage";
import SearchPage from '../pages/SearchPage'

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