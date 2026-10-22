import { useCallback, useEffect, useRef, useState } from 'react';

const YT_ORIGINS = ['https://www.youtube-nocookie.com', 'https://www.youtube.com'];

export function isYoutubeEmbedMessage(event) {
  return YT_ORIGINS.some((o) => event.origin === o || event.origin.endsWith('.youtube.com'));
}

/** 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued */
export function isYoutubeEndedMessage(data) {
  if (!data || typeof data !== 'object') return false;
  if (data.event === 'onStateChange' && data.info === 0) return true;
  if (data.event === 'infoDelivery' && data.info?.playerState === 0) return true;
  return false;
}

export function isYoutubeActiveMessage(data) {
  if (!data || typeof data !== 'object') return false;
  const activeStates = [1, 3, 5];
  if (data.event === 'onStateChange' && activeStates.includes(data.info)) return true;
  if (data.event === 'infoDelivery' && activeStates.includes(data.info?.playerState)) return true;
  return false;
}

export function isYoutubePlayingMessage(data) {
  if (!data || typeof data !== 'object') return false;
  if (data.event === 'onStateChange' && data.info === 1) return true;
  if (data.event === 'infoDelivery' && data.info?.playerState === 1) return true;
  return false;
}

/** 2 = paused — we auto-resume so YouTube's pause overlay does not stick */
export function isYoutubePausedMessage(data) {
  if (!data || typeof data !== 'object') return false;
  if (data.event === 'onStateChange' && data.info === 2) return true;
  if (data.event === 'infoDelivery' && data.info?.playerState === 2) return true;
  return false;
}

export function isYoutubeErrorMessage(data) {
  if (!data || typeof data !== 'object') return false;
  return data.event === 'onError';
}

export function parseYoutubeMessage(raw) {
  if (typeof raw !== 'string' || raw[0] !== '{') return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function subscribeYoutubeIframe(iframe) {
  const win = iframe?.contentWindow;
  if (!win) return;
  win.postMessage(
    JSON.stringify({ event: 'listening', id: iframe.id || 'trailer', channel: 'widget' }),
    '*'
  );
}

export function postYoutubeCommand(iframe, func, args = []) {
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify({ event: 'command', func, args }),
    '*'
  );
}

export function startYoutubePlayback(iframe, { muted = true } = {}) {
  subscribeYoutubeIframe(iframe);
  if (muted) {
    postYoutubeCommand(iframe, 'mute');
  } else {
    postYoutubeCommand(iframe, 'unMute');
    postYoutubeCommand(iframe, 'setVolume', [100]);
  }
  postYoutubeCommand(iframe, 'playVideo');
}

export function unmuteYoutubePlayer(iframe) {
  postYoutubeCommand(iframe, 'unMute');
  postYoutubeCommand(iframe, 'setVolume', [100]);
}

/**
 * Trailer lifecycle: only treat explicit YouTube errors as unavailable (not startup timeout).
 */
export function useYoutubeTrailerEmbed({
  active,
  onEnded,
  onUnavailable,
  onPlaying,
  iframeRef,
  resumeOnPause = false,
}) {
  const [isActive, setIsActive] = useState(false);
  const settledRef = useRef(false);
  const playingRef = useRef(false);

  const settleUnavailable = useCallback(() => {
    if (settledRef.current) return;
    settledRef.current = true;
    setIsActive(false);
    onUnavailable?.();
  }, [onUnavailable]);

  const settleEnded = useCallback(() => {
    if (settledRef.current) return;
    settledRef.current = true;
    onEnded?.();
  }, [onEnded]);

  useEffect(() => {
    if (!active) {
      settledRef.current = false;
      playingRef.current = false;
      setIsActive(false);
      return undefined;
    }
    settledRef.current = false;
    playingRef.current = false;
    setIsActive(false);

    const handleMessage = (event) => {
      if (!isYoutubeEmbedMessage(event)) return;
      const data = parseYoutubeMessage(event.data);
      if (!data || settledRef.current) return;

      if (isYoutubeErrorMessage(data)) {
        settleUnavailable();
        return;
      }
      if (isYoutubeActiveMessage(data)) {
        setIsActive(true);
      }
      if (isYoutubePlayingMessage(data) && !playingRef.current) {
        playingRef.current = true;
        onPlaying?.();
      }
      if (resumeOnPause && isYoutubePausedMessage(data)) {
        postYoutubeCommand(iframeRef?.current, 'playVideo');
      }
      if (isYoutubeEndedMessage(data)) {
        settleEnded();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [active, iframeRef, onPlaying, resumeOnPause, settleEnded, settleUnavailable]);

  return { isActive };
}
