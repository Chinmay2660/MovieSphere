import { MdHomeFilled, MdLocalMovies } from "react-icons/md";
import { PiTelevisionFill } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram, FaGithub } from 'react-icons/fa';


export const navigation = [
    { title: "TV Shows", path: "/tv", icon: <PiTelevisionFill /> },
    { title: "Movies", path: "/movie", icon: <MdLocalMovies /> },
];

export const mobileNavigation = [
    { title: "Home", path: "/", icon: <MdHomeFilled /> },
    ...navigation,
    { title: "Search", path: "/search", icon: <IoSearchOutline /> },
]

export const features = [
    {
        icon:
            <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                <path d="M0 12C0 5.373 5.373 0 12 0c4.873 0 9.067 2.904 10.947 7.077l-15.87 15.87a11.981 11.981 0 0 1-1.935-1.099L14.99 12H12l-8.485 8.485A11.962 11.962 0 0 1 0 12Zm12.004 12L24 12.004C23.998 18.628 18.628 23.998 12.004 24Z" />
            </svg>,
        title: "Vast Movie Library",
        desc: "Thousands of movies, spanning diverse genres, languages, and decades."
    },
    {
        icon:
            <svg className="h-12 w-12 fill-current" viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>,
        title: "Personalized Recommendations",
        desc: "Suggesting movies and shows tailored to your taste."
    },
    {
        icon:
            <svg className="h-12 w-12 fill-current" viewBox="0 0 24 24">
                <path d="M4 1.5C2.17363 1.5 0.5 2.9003 0.5 4.85714V14.1429C0.5 16.0997 2.17363 17.5 4 17.5H10.5V19.5H7.5C6.94772 19.5 6.5 19.9477 6.5 20.5V21.5C6.5 22.0523 6.94771 22.5 7.5 22.5H16.5C17.0523 22.5 17.5 22.0523 17.5 21.5V20.5C17.5 19.9477 17.0523 19.5 16.5 19.5H13.5V17.5H20C21.8264 17.5 23.5 16.0997 23.5 14.1429V4.85714C23.5 2.9003 21.8264 1.5 20 1.5H4Z" />
            </svg>,
        title: "Multiple Device Support",
        desc: "Including smart TVs, smartphones, tablets, laptops, and gaming consoles."
    },
    {
        icon:
            <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
            </svg>,
        title: "Watch Party",
        desc: "Watch together with friends. Chat and react in real time to the same stream."
    },
    {
        icon:
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="h-12 w-12 fill-current"
            >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>,
        title: "High-Definition Streaming",
        desc: "Stunning visuals with content available in 4K, Ultra HD and HDR."
    },
    {
        icon:
            <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
            </svg>,
        title: "Free",
        desc: "Everything is free, no subscription or credit card required."
    },
]

export const faqsList = [
    {
        q: "What is Movie Sphere?",
        a: "Movie Sphere's the #1 free ad-supported entertainment streamer. With the largest library in the entire streaming universe and personalised content recommendations, we've got it all—available on all your devices. Discover hit movies, bingeable shows, and award-winning Originals. No subscriptions. No credit cards. No fees."
    },
    {
        q: "Is Movie Sphere really free?",
        a: "Yes! Movie Sphere is a free (and legal) video streaming application. To keep our service free and legal, we include adverts, which monetise the content that our partners, such as MGM, Lionsgate, and Paramount, provide to us!"
    },
    {
        q: "Is Movie Sphere really free?",
        a: "Yes! Movie Sphere is a free (and legal) video streaming application. To keep our service free and legal, we include adverts, which monetise the content that our partners, such as MGM, Lionsgate, and Paramount, provide to us!"
    },
];

export const socialMediaLinks = [
    { href: 'javascript:void()', icon: FaTwitter, label: 'Twitter' },
    { href: 'javascript:void()', icon: FaFacebookF, label: 'Facebook' },
    { href: 'javascript:void()', icon: FaLinkedinIn, label: 'LinkedIn' },
    { href: 'javascript:void()', icon: FaInstagram, label: 'Instagram' },
    { href: 'javascript:void()', icon: FaGithub, label: 'GitHub' },
];