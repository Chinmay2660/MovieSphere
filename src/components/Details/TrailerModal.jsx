import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { lockBodyScroll } from '../../lib/scrollLock';
import { youtubeEmbedUrl } from '../../lib/tmdbVideos';
import {
  isYoutubeEmbedMessage,
  isYoutubeEndedMessage,
  parseYoutubeMessage,
} from '../../lib/youtubeEmbed';
import LazyImage from '../Reusables/LazyImage';

const TrailerModal = ({ youtubeKey, title, closeLabel, posterSrc, onClose }) => {
  const [iframeReady, setIframeReady] = useState(false);

  const src = useMemo(
    () =>
      youtubeEmbedUrl(youtubeKey, {
        autoplay: true,
        mute: false,
        controls: true,
        loop: false,
      }),
    [youtubeKey]
  );

  useEffect(() => lockBodyScroll(), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (!isYoutubeEmbedMessage(event)) return;
      const data = parseYoutubeMessage(event.data);
      if (isYoutubeEndedMessage(data)) onClose();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose]);

  if (!youtubeKey) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
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
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl aspect-video">
        {posterSrc && !iframeReady && (
          <LazyImage
            src={posterSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <iframe
          title={title}
          src={src}
          onLoad={() => setIframeReady(true)}
          className="absolute inset-0 z-10 h-full w-full border-0 bg-black"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>,
    document.body
  );
};

export default TrailerModal;
