import { useRef } from "react";
import PropTypes from "prop-types";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Card from "./Card";

const CardCarousel = ({ data, trending, heading }) => {
    const containerRef = useRef(null);

    const handlePrevClick = () => {
        containerRef.current.scrollLeft -= 300;
    };

    const handleNextClick = () => {
        containerRef.current.scrollLeft += 300;
    };

    return (
        <div className="relative mx-10 my-10 group">
            <h2 className="text-xl font-bold lg:text-2xl mb-4">{heading}</h2>
            <div className="overflow-hidden relative">
                <div
                    ref={containerRef}
                    className="flex overflow-x-auto space-x-4 scrollbar-none"
                >
                    {data.map((item, index) => (
                        <div key={item.id + "heading" + index} className="min-w-[230px] flex-shrink-0">
                            <Card data={item} index={index + 1} trending={trending} />
                        </div>
                    ))}
                </div>

                <button
                    onClick={handlePrevClick}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300 hidden group-hover:flex ml-2"
                >
                    <IoChevronBack className="w-6 h-6 hover:scale-125 transition-transform duration-300" />
                </button>

                <button
                    onClick={handleNextClick}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300 hidden group-hover:flex mr-2"
                >
                    <IoChevronForward className="w-6 h-6 hover:scale-125 transition-transform duration-300" />
                </button>
            </div>
        </div>
    );
};

CardCarousel.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired,
    heading: PropTypes.string.isRequired,
    trending: PropTypes.bool.isRequired
};

export default CardCarousel;
