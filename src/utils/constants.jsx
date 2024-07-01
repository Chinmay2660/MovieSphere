import { MdHomeFilled, MdLocalMovies } from "react-icons/md";
import { PiTelevisionFill } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";

export const navigation = [
    { title: "TV Shows", path: "/tv", icon: <PiTelevisionFill /> },
    { title: "Movies", path: "/movies", icon: <MdLocalMovies /> },
];

export const mobileNavigation = [
    { title: "Home", path: "/", icon: <MdHomeFilled /> },
    ...navigation,
    { title: "Search", path: "/search", icon: <IoSearchOutline /> },

]