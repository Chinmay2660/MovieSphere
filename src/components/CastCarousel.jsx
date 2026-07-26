import { useRef, useState, useEffect, useCallback } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import LazyImage from "./Reusables/LazyImage";

const SCROLL_THRESHOLD = 8;

const CastCarousel = ({ castData, imageURL }) => {
    const containerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setCanScrollLeft(scrollLeft > SCROLL_THRESHOLD);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - SCROLL_THRESHOLD);
    }, []);

    useEffect(() => {
        updateScrollState();
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(updateScrollState);
        ro.observe(el);
        return () => ro.disconnect();
    }, [castData, updateScrollState]);

    const handlePrevClick = () => {
        containerRef.current?.scrollBy({ left: -150, behavior: "smooth" });
    };

    const handleNextClick = () => {
        containerRef.current?.scrollBy({ left: 150, behavior: "smooth" });
    };

    return (
        <div className="relative group/cast">
            <div className="overflow-hidden relative">
                <div
                    ref={containerRef}
                    className="flex overflow-x-auto gap-4 scrollbar-none scroll-smooth"
                    onScroll={updateScrollState}
                >
                    {castData.map((item, index) => (
                        <div key={index} className="flex-shrink-0 w-[100px] sm:w-[150px] flex flex-col items-center">
                            {imageURL && item?.profile_path && (
                                <div className="relative">
                                    <LazyImage
                                        src={imageURL + item?.profile_path}
                                        alt={item?.name}
                                        className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-full"
                                        width={128}
                                        height={128}
                                        style={{ aspectRatio: "1/1" }}
                                    />
                                </div>
                            )}
                            <p className="text-center mt-2 text-secondary font-bold text-xs lg:text-sm line-clamp-2 w-full px-1">
                                {item?.name}
                            </p>
                        </div>
                    ))}
                </div>

                {canScrollLeft && (
                    <button
                        onClick={handlePrevClick}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-surface-elevated text-text p-2 rounded-full hover:bg-surface-elevated transition-all duration-300 flex items-center justify-center ml-1 z-10 opacity-100 md:opacity-0 md:group-hover/cast:opacity-100"
                        aria-label="Previous"
                    >
                        <IoChevronBack className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                )}

                {canScrollRight && (
                    <button
                        onClick={handleNextClick}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-surface-elevated text-text p-2 rounded-full hover:bg-surface-elevated transition-all duration-300 flex items-center justify-center mr-1 z-10 opacity-100 md:opacity-0 md:group-hover/cast:opacity-100"
                        aria-label="Next"
                    >
                        <IoChevronForward className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default CastCarousel;
