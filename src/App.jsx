import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Search from "./components/Search";
import LandingPageMain from "./pages/LandingPageMain";

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