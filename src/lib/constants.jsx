import { FaTwitter, FaLinkedinIn, FaInstagram, FaGithub } from 'react-icons/fa';
import {
    IoHomeOutline, IoHome,
    IoTvOutline, IoTv,
    IoFilmOutline, IoFilm,
    IoBookmarkOutline, IoBookmark,
    IoDownloadOutline, IoDownload,
    IoSearchOutline,
    IoPhonePortraitOutline,
    IoPlayCircleOutline,
} from 'react-icons/io5';

export const navigation = [
    { titleKey: "nav.home", path: "/home", shortTitleKey: "nav.home", icon: IoHomeOutline, iconActive: IoHome },
    { titleKey: "nav.series", path: "/tv", shortTitleKey: "nav.series", icon: IoTvOutline, iconActive: IoTv },
    { titleKey: "nav.movies", path: "/movie", shortTitleKey: "nav.movies", icon: IoFilmOutline, iconActive: IoFilm },
    { titleKey: "nav.watchlist", path: "/watchlist", shortTitleKey: "nav.watchlist", icon: IoBookmarkOutline, iconActive: IoBookmark },
    { titleKey: "nav.downloads", path: "/downloads", shortTitleKey: "nav.downloads", icon: IoDownloadOutline, iconActive: IoDownload },
];

export const features = [
    {
        icon: <IoFilmOutline className="h-6 w-6" />,
        title: "Bollywood & Regional",
        desc: "Hindi, Marathi, and English — Indian cinema alongside global hits.",
    },
    {
        icon: <IoSearchOutline className="h-6 w-6" />,
        title: "Instant Search",
        desc: "Find any movie or series in seconds. Filter by genre, year, or IMDb-style ratings.",
    },
    {
        icon: <IoBookmarkOutline className="h-6 w-6" />,
        title: "Your Watchlist",
        desc: "Save what to watch next — perfect for weekend binge plans with family or friends.",
    },
    {
        icon: <IoDownloadOutline className="h-6 w-6" />,
        title: "Offline Downloads",
        desc: "Download for metro rides, long flights, or patchy network — watch without burning mobile data.",
    },
    {
        icon: <IoPlayCircleOutline className="h-6 w-6" />,
        title: "One-Tap Playback",
        desc: "No sign-up, no OTP, no subscription. Tap play and start watching.",
    },
    {
        icon: <IoPhonePortraitOutline className="h-6 w-6" />,
        title: "Mobile-First",
        desc: "Built for how India watches — phone, tablet, or laptop, on Jio, Airtel, or Wi‑Fi.",
    },
]

export const faqsList = [
    {
        q: "What is MovieSphere?",
        a: "MovieSphere is a free streaming platform for Bollywood, regional Indian cinema, and international movies & series. Browse trending titles, build a watchlist, download for offline viewing — no account or subscription needed."
    },
    {
        q: "Is MovieSphere really free?",
        a: "Yes. No subscriptions, no credit cards, and no hidden fees. Open the app, pick a title, and press play — ₹0 forever."
    },
    {
        q: "Can I download movies and series for offline viewing?",
        a: "Yes. Save movies and episodes from the details page, then watch from the Downloads tab — ideal for commutes or when your network is weak."
    },
    {
        q: "Does it work on my phone?",
        a: "Any modern browser on Android or iPhone, plus tablets and laptops. The interface is optimised for Indian mobile screens and touch controls."
    },
];

export const socialMediaLinks = [
    { href: 'https://github.com/Chinmay2660', icon: FaGithub, label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/chinmay2660/', icon: FaLinkedinIn, label: 'LinkedIn' },
    { href: 'https://www.instagram.com/chinmay__bhoir?igsh=Z2hsZHczdWhxNXd6&utm_source=qr', icon: FaInstagram, label: 'Instagram' },
    { href: 'https://x.com/ChinmayBhoir14', icon: FaTwitter, label: 'Twitter' },
];
