/** Pick the best YouTube key from TMDB /videos response. */
export function pickYoutubeTrailer(videosResponse) {
  const results = videosResponse?.results ?? [];
  const onYoutube = results.filter(
    (v) => String(v?.site ?? '').toLowerCase() === 'youtube' && v?.key
  );
  if (!onYoutube.length) return null;

  const pick =
    onYoutube.find((v) => v.type === 'Trailer' && v.official) ||
    onYoutube.find((v) => v.type === 'Trailer') ||
    onYoutube.find((v) => v.type === 'Teaser') ||
    onYoutube[0];

  return pick?.key ? { key: String(pick.key), name: pick.name || 'Trailer' } : null;
}

export function youtubeWatchUrl(key) {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(key)}`;
}

/**
 * Standard embed URL. Use mute+autoplay for hero; modal should open with mute=0 right after user tap.
 */
export function youtubeEmbedUrl(
  key,
  { autoplay = false, mute = false, controls = false, loop = false } = {}
) {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: mute ? '1' : '0',
    controls: controls ? '1' : '0',
    playsinline: '1',
    modestbranding: '1',
    rel: '0',
    enablejsapi: '1',
    disablekb: controls ? '0' : '1',
    fs: controls ? '1' : '0',
    iv_load_policy: '3',
  });
  if (typeof window !== 'undefined') {
    params.set('origin', window.location.origin);
  }
  if (loop) {
    params.set('loop', '1');
    params.set('playlist', key);
  }
  return `https://www.youtube.com/embed/${encodeURIComponent(key)}?${params}`;
}
