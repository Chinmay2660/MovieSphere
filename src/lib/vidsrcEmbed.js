/**
 * Free TMDB embed players (iframe). Order = default preference; user can switch in the player.
 * @see https://www.vidlink.pro/
 */

const PLAYBACK_QUERY = new URLSearchParams({
  autoplay: "false",
  nextbutton: "false",
  title: "false",
  poster: "false",
}).toString();

const withQuery = (base) => (base.includes("?") ? base : `${base}?${PLAYBACK_QUERY}`);

/** @typedef {{ id: string, name: string, isDirect?: boolean, getMovieUrl: (tmdbId: string|number) => string, getTvUrl: (tmdbId: string|number, season: number, episode: number) => string }} PlaybackSource */

/** Lower ad noise where embed params allow; order = default try order. */
/** @type {PlaybackSource[]} */
export const PLAYBACK_SOURCES = [
  {
    id: "videasy",
    name: "Videasy",
    getMovieUrl: (id) =>
      `https://player.videasy.to/movie/${id}?autoplay=false&chromecast=false`,
    getTvUrl: (id, s, e) =>
      `https://player.videasy.to/tv/${id}/${s}/${e}?autoplay=false&chromecast=false`,
  },
  {
    id: "vidfast",
    name: "VidFast",
    getMovieUrl: (id) =>
      `https://vidfast.vc/movie/${id}?autoPlay=false&nextButton=false&title=false&poster=false`,
    getTvUrl: (id, s, e) =>
      `https://vidfast.vc/tv/${id}/${s}/${e}?autoPlay=false&nextButton=false&title=false&poster=false`,
  },
  {
    id: "vidlink",
    name: "VidLink",
    getMovieUrl: (id) => withQuery(`https://vidlink.pro/movie/${id}`),
    getTvUrl: (id, s, e) => withQuery(`https://vidlink.pro/tv/${id}/${s}/${e}`),
  },
  {
    id: "vidsrc_su",
    name: "VidSrc",
    getMovieUrl: (id) =>
      `https://vidsrc.su/movie/${id}?autoplay=false&pausescreen=false&autonextepisode=true`,
    getTvUrl: (id, s, e) =>
      `https://vidsrc.su/tv/${id}/${s}/${e}?autoplay=false&pausescreen=false&autonextepisode=true`,
  },
  {
    id: "vidrock",
    name: "VidRock",
    getMovieUrl: (id) => `https://vidrock.net/movie/${id}?autoplay=false&autonext=false`,
    getTvUrl: (id, s, e) =>
      `https://vidrock.net/tv/${id}/${s}/${e}?autoplay=false&autonext=false`,
  },
  {
    id: "direct",
    name: "Direct stream",
    isDirect: true,
    getMovieUrl: (id) => `/api/stream/movie/${id}`,
    getTvUrl: (id, s, e) => `/api/stream/tv/${id}/${s}/${e}`,
  },
];

const STORAGE_KEY = "moviesphere_playback_source";

export const getDefaultPlaybackSourceId = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && PLAYBACK_SOURCES.some((s) => s.id === saved)) return saved;
  } catch {
    // private mode
  }
  return PLAYBACK_SOURCES[0].id;
};

export const persistPlaybackSourceId = (id) => {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // ignore
  }
};

export const findPlaybackSource = (id) =>
  PLAYBACK_SOURCES.find((s) => s.id === id) ?? PLAYBACK_SOURCES[0];

/** @deprecated use PLAYBACK_SOURCES */
export const VIDSRC_EMBED = PLAYBACK_SOURCES.find((s) => s.id === "vidsrc_su");

export const getMovieEmbedUrl = (tmdbId) => findPlaybackSource(getDefaultPlaybackSourceId()).getMovieUrl(tmdbId);
export const getTvEmbedUrl = (tmdbId, season, episode) =>
  findPlaybackSource(getDefaultPlaybackSourceId()).getTvUrl(tmdbId, season, episode);
