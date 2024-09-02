import { useRef, useState, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const CastCarousel = ({ castData, imageURL }) => {
    const containerRef = useRef(null);
    const [showPrevButton, setShowPrevButton] = useState(false);
    const [showNextButton, setShowNextButton] = useState(false);

    const handlePrevClick = () => {
        containerRef.current.scrollLeft -= 150;
    };

    const handleNextClick = () => {
        containerRef.current.scrollLeft += 150;
    };

    const updateButtonVisibility = () => {
        if (!containerRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setShowPrevButton(scrollLeft > 0);
        setShowNextButton(scrollWidth > clientWidth + scrollLeft);
    };

    useEffect(() => {
        updateButtonVisibility();
        window.addEventListener('resize', updateButtonVisibility);
        return () => window.removeEventListener('resize', updateButtonVisibility);
    }, [castData]);

    return (
        <div
            className="relative group"
            onMouseEnter={() => {
                setShowPrevButton(containerRef.current.scrollLeft > 0);
                setShowNextButton(containerRef.current.scrollWidth > containerRef.current.clientWidth + containerRef.current.scrollLeft);
            }}
            onMouseLeave={() => {
                setShowPrevButton(false);
                setShowNextButton(false);
            }}
        >
            <div className="overflow-hidden relative">
                <div
                    ref={containerRef}
                    className="flex overflow-x-auto space-x-4 scrollbar-none"
                    onScroll={updateButtonVisibility}
                >
                    {castData.map((item, index) => (
                        <div key={index} className="flex-shrink-0 w-[150px] flex flex-col items-center">
                            {imageURL && item?.profile_path && (
                                <img
                                    src={imageURL + item?.profile_path}
                                    alt={item?.name}
                                    className="h-32 w-32 object-cover rounded-full"
                                    width={128}
                                    height={128}
                                    loading="lazy"
                                    style={{ aspectRatio: '1/1' }}
                                />
                            )}
                            <div className="text-center mt-2">
                                <p className="text-neutral-400 font-bold text-xs lg:text-sm">{item?.name.split(" ")[0]}</p>
                                <p className="text-neutral-400 font-bold text-xs lg:text-sm">{item?.name.split(" ")[1]}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {showPrevButton && (
                    <button
                        onClick={handlePrevClick}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300 flex items-center justify-center ml-2 z-10"
                    >
                        <IoChevronBack className="w-6 h-6" />
                    </button>
                )}

                {showNextButton && (
                    <button
                        onClick={handleNextClick}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300 flex items-center justify-center mr-2 z-10"
                    >
                        <IoChevronForward className="w-6 h-6" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default CastCarousel;
