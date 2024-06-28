import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Search from "./components/Search";
import LandingPageMain from "./components/LandingPage/LandingPageMain";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPageMain/>,
  },
  {
    path: "/search",
    element: <Search/>,
  },
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App