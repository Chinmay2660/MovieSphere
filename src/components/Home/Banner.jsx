import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { IoPlay, IoInformationCircleOutline, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import VideoPlay from "../VideoPlay";
import LazyImage from "../Reusables/LazyImage";
import axiosInstance from "../../lib/axiosConfig";
import { getRatingColor, getTmdbImageUrl, TMDB_IMAGE_SIZES } from "../../lib/utils";
import { useLocale } from "../../context/LocaleContext";

const MAX_SLIDES = 10;

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const bannerData = useSelector((state) => state.movieData.bannerData);
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const slides = useMemo(
    () =>
      bannerData
        .filter((item) => item.media_type === "movie" || item.media_type === "tv")
        .slice(0, MAX_SLIDES),
    [bannerData]
  );
  const [playVideo, setPlayVideo] = useState(false);
  const [playVideoData, setPlayVideoData] = useState();
  const navigate = useNavigate();
  const { t } = useLocale();
  const touchStartX = useRef(null);

  const slideCount = slides.length;

  const handlePrevClick = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slideCount - 1 : prevIndex - 1));
  }, [slideCount]);

  const handleNextClick = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === slideCount - 1 ? 0 : prevIndex + 1));
  }, [slideCount]);

  const handleVideoPlay = useCallback(async (data) => {
    if (!data.id || (data.media_type !== "movie" && data.media_type !== "tv")) return;

    if (data.media_type === "tv") {
      const { data: tvData } = await axiosInstance.get(`/tv/${data.id}`);
      setPlayVideoData({ ...data, seasons: tvData.seasons });
    } else {
      setPlayVideoData(data);
    }

    setPlayVideo(true);
  }, []);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNextClick();
      else handlePrevClick();
    }
    touchStartX.current = null;
  }, [handleNextClick, handlePrevClick]);

  const handleKeyDown = useCallback((e) => {
    if (slideCount <= 1) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrevClick();
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNextClick();
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setCurrentIndex(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setCurrentIndex(slideCount - 1);
    }
  }, [handleNextClick, handlePrevClick, slideCount]);

  const pauseCarousel = useCallback(() => setIsPaused(true), []);
  const resumeCarousel = useCallback(() => setIsPaused(false), []);

  useEffect(() => {
    if (currentIndex >= slideCount) setCurrentIndex(0);
  }, [currentIndex, slideCount]);

  useEffect(() => {
    if (!playVideo && !isPaused && !prefersReducedMotion && slideCount > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex === slideCount - 1 ? 0 : prevIndex + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slideCount, playVideo, isPaused, prefersReducedMotion]);

  if (!slideCount) return null;

  const currentSlide = slides[currentIndex];
  const currentTitle =
    currentSlide.media_type === "tv" ? currentSlide.name : currentSlide.title;

  return (
    <section
      className="relative isolate w-full overflow-hidden group pt-14 sm:pt-0 aspect-[4/5] max-h-[min(72dvh,640px)] sm:aspect-[16/9] sm:max-h-[80dvh] shadow-[0_16px_32px_12px_rgba(12,10,9,0.55)]"
      aria-roledescription="carousel"
      aria-label={t("banner.carousel")}
      tabIndex={slideCount > 1 ? 0 : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      onMouseEnter={pauseCarousel}
      onMouseLeave={resumeCarousel}
      onFocusCapture={pauseCarousel}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) resumeCarousel();
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{
            width: `${slideCount * 100}%`,
            transform: `translateX(-${(currentIndex / slideCount) * 100}%)`,
          }}
        >
          {slides.map((data, index) => {
            const isNearSlide = Math.abs(index - currentIndex) <= 1;
            const title = data.media_type === "tv" ? data.name : data.title;

            return (
              <div
                key={data.id}
                className="relative h-full shrink-0"
                style={{ width: `${100 / slideCount}%` }}
                aria-hidden={index !== currentIndex}
              >
                {isNearSlide && imageURL && data.backdrop_path ? (
                  <LazyImage
                    src={getTmdbImageUrl(imageURL, data.backdrop_path, TMDB_IMAGE_SIZES.backdropHero)}
                    alt={index === currentIndex && title ? `Banner for ${title}` : ""}
                    eager={index === 0}
                    width={1280}
                    height={720}
                    sizes="100vw"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 bg-surface" aria-hidden />
                )}

                <div
                  className="absolute inset-0 bg-gradient-to-t from-background/80 from-0% via-background/35 via-45% to-transparent to-75%"
                  aria-hidden
                />
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 -bottom-6 z-[6] h-14 bg-gradient-to-b from-transparent via-background/30 to-background/75 sm:-bottom-8 sm:h-20"
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-6 pt-16 sm:px-8 sm:pb-8 md:px-16">
        <div className="mx-auto w-full max-w-md md:mx-0">
          <h2 className="text-xl font-bold text-text drop-shadow-2xl line-clamp-2 sm:text-2xl lg:text-4xl">
            {currentTitle}
          </h2>
          <p className="my-2 line-clamp-2 text-sm text-text/90 drop-shadow-lg sm:line-clamp-3 sm:text-base">
            {currentSlide.overview}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-text sm:gap-4 sm:text-base">
            {currentSlide.vote_average > 0 && (
              <p className={getRatingColor(currentSlide.vote_average).text}>
                {t('banner.rating')}: {Number(currentSlide.vote_average).toFixed(1)}/10
              </p>
            )}
            {currentSlide.popularity > 0 && (
              <>
                <span className="text-muted">|</span>
                <p className="text-green-400">
                  {t('banner.views')}: {Number(currentSlide.popularity).toFixed(0)}+
                </p>
              </>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:gap-6">
            <motion.button
              type="button"
              onClick={() => handleVideoPlay(currentSlide)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label={t("banner.playNowFor", { title: currentTitle })}
              className="btn-primary flex items-center justify-center gap-2 px-5 py-2.5 text-sm active:scale-[0.97] sm:min-w-[9rem]"
            >
              <IoPlay className="h-4 w-4" aria-hidden />
              <span>{t('banner.playNow')}</span>
            </motion.button>
            <button
              type="button"
              onClick={() => navigate(`/${currentSlide.media_type}/${currentSlide.id}`)}
              aria-label={t("banner.moreDetailsFor", { title: currentTitle })}
              className="btn-ghost flex items-center justify-center gap-2 px-5 py-2.5 text-sm active:scale-[0.97] sm:min-w-[9rem]"
            >
              <IoInformationCircleOutline className="h-4 w-4 text-accent" aria-hidden />
              <span>{t('banner.moreDetails')}</span>
            </button>
          </div>
        </div>

        {slideCount > 1 && (
          <div
            className="mt-4 flex w-full items-center justify-center gap-1.5 sm:mt-5"
            role="group"
            aria-label={t("banner.slideNavigation")}
          >
            {slides.map((_, i) => (
              <motion.button
                key={i}
                type="button"
                aria-current={i === currentIndex ? "true" : undefined}
                aria-label={t("banner.goToSlide", { index: i + 1, count: slideCount })}
                onClick={() => setCurrentIndex(i)}
                animate={{
                  width: i === currentIndex ? 20 : 6,
                  opacity: i === currentIndex ? 1 : 0.4,
                }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="h-1.5 shrink-0 rounded-full bg-text"
              />
            ))}
          </div>
        )}
      </div>

      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrevClick}
            className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 liquid-glass-strong rounded-full p-2 text-text transition-all hover:scale-105 focus-visible:scale-105 sm:flex sm:left-4 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
            aria-label={t('banner.prevSlide')}
          >
            <IoChevronBack className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
          </button>
          <button
            type="button"
            onClick={handleNextClick}
            className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 liquid-glass-strong rounded-full p-2 text-text transition-all hover:scale-105 focus-visible:scale-105 sm:flex sm:right-4 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
            aria-label={t('banner.nextSlide')}
          >
            <IoChevronForward className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
          </button>
        </>
      )}

      {playVideo && playVideoData.id && (
        <VideoPlay
          playVideoId={playVideoData.id}
          media_type={playVideoData.media_type}
          seasons={playVideoData.seasons}
          close={() => setPlayVideo(false)}
        />
      )}
    </section>
  );
};

export default Banner;
