import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import axiosInstance from "../../lib/axiosConfig";
import LazyImage from "../Reusables/LazyImage";
import { getTmdbImageUrl, TMDB_IMAGE_SIZES } from "../../lib/utils";

const pickPosters = (items) =>
    (items ?? []).filter((item) => item.poster_path).slice(0, 14);

const TrendingShowcase = () => {
    const bannerData = useSelector((state) => state.movieData.bannerData);
    const imageURL = useSelector((state) => state.movieData.imageURL);
    const [posters, setPosters] = useState(() => pickPosters(bannerData));

    useEffect(() => {
        if (bannerData.length >= 14) {
            setPosters(pickPosters(bannerData));
            return;
        }

        const loadTrending = async () => {
            try {
                const trendingRes = await axiosInstance.get("/trending/all/week");
                setPosters(pickPosters(trendingRes.data.results));
            } catch {
                // ponytail: landing still works without the marquee
            }
        };
        loadTrending();
    }, [bannerData]);

    if (!posters.length || !imageURL) return null;

    const looped = [...posters, ...posters];

    return (
        <section className="relative z-10 overflow-hidden py-6 sm:py-8">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-5 text-center"
            >
                <span className="section-label">Trending this week</span>
                <p className="apple-footnote mt-2">India-first picks — updated daily</p>
            </motion.div>

            <div className="flex w-max animate-marquee gap-3 px-3 sm:gap-4">
                {looped.map((item, idx) => {
                    const title = item.title || item.name || "Title";
                    const mediaType = item.media_type ?? "movie";
                    return (
                        <a
                            key={`${item.id}-${idx}`}
                            href={`/${mediaType}/${item.id}`}
                            className="group relative w-[7.5rem] shrink-0 overflow-hidden rounded-2xl liquid-glass sm:w-[9rem]"
                        >
                            <div className="aspect-[2/3] overflow-hidden">
                                <LazyImage
                                    src={getTmdbImageUrl(imageURL, item.poster_path, TMDB_IMAGE_SIZES.poster)}
                                    alt={title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <p className="apple-caption-2 absolute bottom-2 left-2 right-2 truncate font-medium text-text opacity-0 transition-opacity group-hover:opacity-100">
                                {title}
                            </p>
                        </a>
                    );
                })}
            </div>
        </section>
    );
};

export default TrendingShowcase;
