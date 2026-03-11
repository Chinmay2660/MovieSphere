import { useRef, useState, useEffect, useCallback } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Card from "./Card";

const SCROLL_THRESHOLD = 8;

const CardCarousel = ({ data, trending, heading, media_type }) => {
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
    }, [data, updateScrollState]);

    const handlePrevClick = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const handleNextClick = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="relative px-4 lg:px-10 py-6 group/carousel">
            <h2 className="text-xl font-bold lg:text-2xl mb-5 text-white">
                {heading}
            </h2>

            <div className="relative">
                <div
                    ref={containerRef}
                    onScroll={updateScrollState}
                    className="flex gap-4 overflow-x-auto overflow-y-visible scrollbar-none scroll-smooth pb-4 pl-8 pr-8"
                >
                    {data.map((item, index) => (
                        <div 
                            key={`${item.id}-${heading}-${index}`} 
                            className="flex-shrink-0 w-[196px] sm:w-[216px] lg:w-[236px] py-3 px-2"
                        >
                            <Card 
                                data={item} 
                                index={index + 1} 
                                trending={trending} 
                                media_type={media_type} 
                            />
                        </div>
                    ))}
                </div>

                {canScrollLeft && (
                    <button
                        onClick={handlePrevClick}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10
                                   w-10 h-10 lg:w-12 lg:h-12 
                                   bg-black/70 hover:scale-110 
                                   text-white rounded-full 
                                   flex items-center justify-center
                                   opacity-0 group-hover/carousel:opacity-100
                                   transition-all duration-300
                                   shadow-lg backdrop-blur-sm"
                        aria-label="Previous"
                    >
                        <IoChevronBack className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                )}

                {canScrollRight && (
                    <button
                        onClick={handleNextClick}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10
                                   w-10 h-10 lg:w-12 lg:h-12 
                                   bg-black/70 hover:scale-110 
                                   text-white rounded-full 
                                   flex items-center justify-center
                                   opacity-0 group-hover/carousel:opacity-100
                                   transition-all duration-300
                                   shadow-lg backdrop-blur-sm"
                        aria-label="Next"
                    >
                        <IoChevronForward className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                )}

                <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
};

export default CardCarousel;
