import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoArrowForwardOutline, IoPlay, IoSparkles } from "react-icons/io5";
import { useSelector } from "react-redux";
import axiosInstance from "../../lib/axiosConfig";
import PosterFan from "../Reusables/PosterFan.jsx";

const stats = [
    { value: "10K+", label: "Titles" },
    { value: "₹0", label: "Forever" },
    { value: "HD", label: "Quality" },
];

const genrePills = ["Hindi", "Marathi", "English", "Action"];

const pickPosters = (items) =>
    (items ?? []).filter((item) => item.poster_path).slice(0, 3);

const HeroSection = () => {
    const bollywoodData = useSelector((state) => state.movieData.bollywoodData);
    const imageURL = useSelector((state) => state.movieData.imageURL);
    const [heroPosters, setHeroPosters] = useState(() => pickPosters(bollywoodData));

    useEffect(() => {
        if (bollywoodData.length >= 3) {
            setHeroPosters(pickPosters(bollywoodData));
            return;
        }

        const loadHeroPosters = async () => {
            try {
                const trendingRes = await axiosInstance.get("/discover/movie", {
                    params: { with_original_language: "hi", sort_by: "popularity.desc" },
                });
                setHeroPosters(pickPosters(trendingRes.data.results));
            } catch {
                // ponytail: hero works without poster stack
            }
        };
        loadHeroPosters();
    }, [bollywoodData]);

    return (
        <section className="relative z-10 flex min-h-[calc(100dvh-3.25rem)] items-center overflow-hidden pt-[calc(4.5rem+env(safe-area-inset-top))] pb-12 sm:min-h-[100dvh] sm:pt-24 sm:pb-20">
            <div className="pointer-events-none absolute inset-0 hero-grid opacity-30 sm:opacity-45" aria-hidden />
            <div className="pointer-events-none absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-accent/20 blur-[80px] sm:h-64 sm:w-64 sm:blur-[100px]" aria-hidden />

            <div className="apple-container grid w-full items-center gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-10 lg:gap-16">
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="liquid-glass rounded-[1.75rem] px-4 py-7 sm:rounded-[2rem] sm:px-8 sm:py-10 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none"
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="glass-pill section-label mb-5 inline-flex items-center gap-2 px-3.5 py-1.5 sm:mb-6"
                    >
                        <IoSparkles className="h-3.5 w-3.5 text-accent" />
                        Free streaming for India
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18, duration: 0.7 }}
                        className="text-[1.875rem] font-bold leading-[1.08] tracking-tight min-[400px]:text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem]"
                    >
                        <span className="gradient-text-vivid">MovieSphere</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.28 }}
                        className="apple-title-2 mt-4 max-w-lg text-text sm:mt-5"
                    >
                        Hindi, Marathi &amp; English — all in one place.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.36 }}
                        className="apple-subheadline mt-3 max-w-md"
                    >
                        Bollywood, Marathi classics, and Hollywood hits — stream free on any device.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 md:hidden"
                    >
                        <PosterFan items={heroPosters} imageURL={imageURL} layout="compact" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.44 }}
                        className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center"
                    >
                        <a href="/home" className="btn-primary w-full gap-2 sm:w-auto">
                            <IoPlay className="h-4 w-4 shrink-0" aria-hidden />
                            Start Watching
                            <IoArrowForwardOutline className="h-4 w-4 shrink-0" aria-hidden />
                        </a>
                        <a href="/movie" className="btn-ghost w-full gap-2 sm:w-auto">
                            Explore Library
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.52 }}
                        className="mt-8 flex flex-wrap gap-2"
                    >
                        {genrePills.map((genre) => (
                            <span key={genre} className="apple-chip text-secondary">
                                {genre}
                            </span>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="liquid-glass mt-8 grid w-full grid-cols-3 divide-x divide-white/8 rounded-2xl sm:mt-10 md:inline-grid md:w-auto"
                    >
                        {stats.map((stat) => (
                            <div key={stat.label} className="px-3 py-3.5 text-center sm:px-6 sm:py-4 md:px-8">
                                <p className="apple-title-2 text-text">{stat.value}</p>
                                <p className="apple-caption-2 mt-1 uppercase tracking-widest text-secondary">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="hidden md:block"
                >
                    <PosterFan items={heroPosters} imageURL={imageURL} layout="floating" />
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
