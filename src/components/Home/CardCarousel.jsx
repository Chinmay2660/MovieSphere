import { useRef } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Card from "./Card";

const CardCarousel = ({ data, trending, heading, media_type }) => {
    const containerRef = useRef(null);

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
            {/* Heading */}
            <h2 className="text-xl font-bold lg:text-2xl mb-5 text-white">
                {heading}
            </h2>

            {/* Carousel Container */}
            <div className="relative">
                {/* Cards Container */}
                <div
                    ref={containerRef}
                    className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-4"
                >
                    {data.map((item, index) => (
                        <div 
                            key={`${item.id}-${heading}-${index}`} 
                            className="flex-shrink-0 w-[160px] sm:w-[180px] lg:w-[200px]"
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

                {/* Navigation Buttons */}
                <button
                    onClick={handlePrevClick}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10
                               w-10 h-10 lg:w-12 lg:h-12 
                               bg-black/70 hover:bg-primary 
                               text-white rounded-full 
                               flex items-center justify-center
                               opacity-0 group-hover/carousel:opacity-100
                               transition-all duration-300
                               shadow-lg backdrop-blur-sm"
                    aria-label="Previous"
                >
                    <IoChevronBack className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>

                <button
                    onClick={handleNextClick}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10
                               w-10 h-10 lg:w-12 lg:h-12 
                               bg-black/70 hover:bg-primary 
                               text-white rounded-full 
                               flex items-center justify-center
                               opacity-0 group-hover/carousel:opacity-100
                               transition-all duration-300
                               shadow-lg backdrop-blur-sm"
                    aria-label="Next"
                >
                    <IoChevronForward className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>

                {/* Gradient Edges */}
                <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
};

export default CardCarousel;
