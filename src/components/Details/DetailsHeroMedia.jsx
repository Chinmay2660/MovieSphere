import { useEffect, useMemo, useRef, useState } from 'react';
import LazyImage from '../Reusables/LazyImage';
import { getTmdbImageUrl, TMDB_IMAGE_SIZES } from '../../lib/utils';
import { youtubeEmbedUrl } from '../../lib/tmdbVideos';
import { subscribeYoutubeIframe, useYoutubeTrailerEmbed } from '../../lib/youtubeEmbed';

/** Backdrop stills + optional muted embed preview (falls back to stills on error). */
const DetailsHeroMedia = ({
  imageURL,
  backdropPath,
  extraBackdropPaths = [],
  trailerKey,
  title,
  paused = false,
}) => {
  const iframeRef = useRef(null);
  const [reduceMotion, setReduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [stillIndex, setStillIndex] = useState(0);
  const [heroTrailerOff, setHeroTrailerOff] = useState(false);

  const stills = useMemo(() => {
    const paths = [backdropPath, ...extraBackdropPaths].filter(Boolean);
    return [...new Set(paths)];
  }, [backdropPath, extraBackdropPaths]);

  useEffect(() => {
    setHeroTrailerOff(false);
  }, [trailerKey]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const tryHeroTrailer =
    Boolean(trailerKey) &&
    !reduceMotion &&
    !paused &&
    !heroTrailerOff &&
    typeof window !== 'undefined';

  const { isActive } = useYoutubeTrailerEmbed({
    active: tryHeroTrailer,
    onEnded: () => setHeroTrailerOff(true),
    onUnavailable: () => setHeroTrailerOff(true),
    iframeRef,
    resumeOnPause: true,
  });

  useEffect(() => {
    if (tryHeroTrailer && isActive) return undefined;
    if (stills.length <= 1 || reduceMotion) return undefined;
    const id = setInterval(() => {
      setStillIndex((i) => (i + 1) % stills.length);
    }, 7000);
    return () => clearInterval(id);
  }, [tryHeroTrailer, isActive, stills.length, reduceMotion]);

  const activeStill = stills[stillIndex] ?? backdropPath;
  const embedSrc = trailerKey
    ? youtubeEmbedUrl(trailerKey, { autoplay: true, mute: true, controls: false, loop: false })
    : '';

  return (
    <div className="relative h-[220px] w-full overflow-hidden sm:h-[280px] lg:h-[400px]">
      {activeStill && imageURL && (
        <LazyImage
          src={getTmdbImageUrl(imageURL, activeStill, TMDB_IMAGE_SIZES.backdrop)}
          alt=""
          eager
          width={780}
          height={400}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {tryHeroTrailer && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <iframe
            ref={iframeRef}
            title=""
            tabIndex={-1}
            src={embedSrc}
            onLoad={() => subscribeYoutubeIframe(iframeRef.current)}
            className={`absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}

      <div
        className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20"
        aria-hidden
      />
      {title && <p className="sr-only">{title}</p>}
    </div>
  );
};

export default DetailsHeroMedia;
