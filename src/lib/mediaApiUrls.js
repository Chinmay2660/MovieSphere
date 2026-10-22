import { isNumericMediaId } from "./safeApiPath";

const encodeTitle = (item) =>
  encodeURIComponent(String(item.title ?? item.show_name ?? "video").slice(0, 120));

/** Same origin proxy as offline download — one resolved stream URL on the server. */
export const buildDownloadPath = (item) => {
  const title = encodeTitle(item);
  if (item.type === "movie") {
    if (!isNumericMediaId(item.id)) throw new Error("Invalid movie id");
    return `/api/download/movie/${item.id}?title=${title}`;
  }
  if (
    !isNumericMediaId(item.tv_id) ||
    !isNumericMediaId(item.season_number) ||
    !isNumericMediaId(item.episode_number)
  ) {
    throw new Error("Invalid episode id");
  }
  return `/api/download/tv/${item.tv_id}/${item.season_number}/${item.episode_number}?title=${title}`;
};

/** Inline byte-range stream; same resolver cache as download (MP4 only on the wire). */
export const buildStreamPath = (item) => {
  if (item.type === "movie") {
    if (!isNumericMediaId(item.id)) throw new Error("Invalid movie id");
    return `/api/stream/movie/${item.id}`;
  }
  if (
    !isNumericMediaId(item.tv_id) ||
    !isNumericMediaId(item.season_number) ||
    !isNumericMediaId(item.episode_number)
  ) {
    throw new Error("Invalid episode id");
  }
  return `/api/stream/tv/${item.tv_id}/${item.season_number}/${item.episode_number}`;
};

export const fetchDownloadAvailability = async (item) => {
  const path = buildDownloadPath(item);
  const url = path.includes("?") ? `${path}&meta=1` : `${path}?meta=1`;
  const response = await fetch(url, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) return { available: false };
  return response.json();
};

export const buildStreamPathFromPlayback = (mediaType, playVideoId, season, episode) => {
  if (mediaType === "tv") {
    return buildStreamPath({
      type: "episode",
      tv_id: playVideoId,
      season_number: season,
      episode_number: episode,
    });
  }
  return buildStreamPath({ type: "movie", id: playVideoId });
};
