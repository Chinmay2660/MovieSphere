import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoClose, IoOpenOutline } from 'react-icons/io5';
import { lockBodyScroll } from '../../lib/scrollLock';
import { youtubeEmbedUrl } from '../../lib/tmdbVideos';
import { subscribeYoutubeIframe, useYoutubeTrailerEmbed } from '../../lib/youtubeEmbed';
import LazyImage from '../Reusables/LazyImage';

const blockPlayerPointer = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

const TrailerModal = ({
  youtubeKey,
  title,
  closeLabel,
  openOnYoutubeLabel,
  posterSrc,
  onClose,
  onOpenYoutube,
}) => {
  const iframeRef = useRef(null);
  const [embedFailed, setEmbedFailed] = useState(false);
  const [src] = useState(() =>
    youtubeEmbedUrl(youtubeKey, {
      autoplay: true,
      mute: false,
      controls: false,
      loop: false,
    })
  );

  useEffect(() => lockBodyScroll(), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleEnded = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleUnavailable = useCallback(() => {
    setEmbedFailed(true);
  }, []);

  const { isActive } = useYoutubeTrailerEmbed({
    active: Boolean(youtubeKey) && !embedFailed,
    onEnded: handleEnded,
    onUnavailable: handleUnavailable,
    iframeRef,
    resumeOnPause: true,
  });

  const handleIframeLoad = () => {
    subscribeYoutubeIframe(iframeRef.current);
  };

  const handleOpenYoutube = () => {
    onOpenYoutube?.();
  };

  if (!youtubeKey) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center gap-4 bg-black/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-[40] rounded-full bg-white/10 p-2.5 text-text hover:bg-white/20"
        aria-label={closeLabel}
      >
        <IoClose className="h-6 w-6" />
      </button>
      <div className="trailer-embed-shell relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl aspect-video">
        {posterSrc && (
          <LazyImage
            src={posterSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {!embedFailed && (
          <>
            <iframe
              id="moviesphere-trailer-embed"
              ref={iframeRef}
              title={title}
              src={src}
              onLoad={handleIframeLoad}
              tabIndex={-1}
              className={`trailer-embed-frame pointer-events-none absolute inset-0 z-10 h-full w-full transition-opacity duration-500 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <div
              className="trailer-touch-blocker absolute inset-0 z-30 bg-transparent"
              role="presentation"
              aria-hidden
              onPointerDown={blockPlayerPointer}
              onPointerUp={blockPlayerPointer}
              onClick={blockPlayerPointer}
              onTouchStart={blockPlayerPointer}
              onTouchEnd={blockPlayerPointer}
              onContextMenu={blockPlayerPointer}
            />
          </>
        )}

        {embedFailed && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="apple-headline text-text">{title}</p>
            <button
              type="button"
              onClick={handleOpenYoutube}
              className="btn-primary inline-flex gap-2 px-6"
            >
              <IoOpenOutline className="h-5 w-5" aria-hidden />
              {openOnYoutubeLabel}
            </button>
          </div>
        )}
      </div>

      {!embedFailed && (
        <button
          type="button"
          onClick={handleOpenYoutube}
          className="btn-ghost z-[40] gap-2 px-4 py-2 text-sm text-text/90"
        >
          <IoOpenOutline className="h-4 w-4 shrink-0" aria-hidden />
          {openOnYoutubeLabel}
        </button>
      )}
    </div>,
    document.body
  );
};

export default TrailerModal;
