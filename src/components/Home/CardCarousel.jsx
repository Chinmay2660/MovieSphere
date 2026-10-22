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

    const scrollPage = () => {
        const el = containerRef.current;
        if (!el) return 400;
        return Math.max(280, Math.round(el.clientWidth * 0.85));
    };

    const handlePrevClick = () =>
        containerRef.current?.scrollBy({ left: -scrollPage(), behavior: 'smooth' });
    const handleNextClick = () =>
        containerRef.current?.scrollBy({ left: scrollPage(), behavior: 'smooth' });

    if (!data?.length) return null;

    return (
        <section className="group/carousel relative w-full min-w-0 max-w-full py-4 sm:py-6">
            <h2 className="apple-title-2 apple-edge-x mb-4 text-text sm:mb-5">{heading}</h2>

            <div className="relative w-full">
                {canScrollLeft && (
                    <div
                        className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-8 bg-gradient-to-r from-background to-transparent sm:w-12"
                        aria-hidden
                    />
                )}
                {canScrollRight && (
                    <div
                        className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-8 bg-gradient-to-l from-background to-transparent sm:w-12"
                        aria-hidden
                    />
                )}

                <div
                    ref={containerRef}
                    onScroll={updateScrollState}
                    className="scroll-row scroll-smooth gap-3 py-1 apple-edge-x sm:gap-4"
                >
                    {data.map((item, index) => (
                        <div
                            key={`${item.id}-${heading}-${index}`}
                            className="w-[42vw] max-w-[220px] shrink-0 sm:w-[200px] md:w-[210px] lg:w-[220px] xl:w-[228px]"
                        >
                            <Card data={item} index={index + 1} trending={trending} media_type={media_type} />
                        </div>
                    ))}
                </div>

                {canScrollLeft && (
                    <button
                        onClick={handlePrevClick}
                        className="liquid-glass-strong absolute left-[max(0.5rem,var(--spacing-inset))] top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-text transition-all hover:scale-105 md:left-[max(1rem,var(--spacing-inset-md))] md:opacity-0 md:group-hover/carousel:opacity-100 lg:left-[max(2.5rem,var(--spacing-inset-lg))]"
                        aria-label="Previous"
                    >
                        <IoChevronBack className="h-5 w-5" />
                    </button>
                )}

                {canScrollRight && (
                    <button
                        onClick={handleNextClick}
                        className="liquid-glass-strong absolute right-[max(0.5rem,var(--spacing-inset))] top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-text transition-all hover:scale-105 md:right-[max(1rem,var(--spacing-inset-md))] md:opacity-0 md:group-hover/carousel:opacity-100 lg:right-[max(2.5rem,var(--spacing-inset-lg))]"
                        aria-label="Next"
                    >
                        <IoChevronForward className="h-5 w-5" />
                    </button>
                )}

            </div>
        </section>
    );
};

export default CardCarousel;
