import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import ExplorePage from "./pages/ExplorePage";
import LandingPage from "./pages/LandingPage";
import DetailsPage from './pages/DetailsPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
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

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App