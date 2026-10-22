import { startDownload } from "./downloadService";

const toDownloadItem = (entry) => {
  if (entry.type === "movie") {
    return {
      type: "movie",
      id: entry.id,
      title: entry.title,
      poster_path: entry.poster_path,
      media_type: "movie",
    };
  }
  return {
    type: "episode",
    tv_id: entry.tv_id,
    season_number: entry.season_number,
    episode_number: entry.episode_number,
    show_name: entry.title,
    episode_name: entry.subtitle,
    still_path: entry.poster_path,
    media_type: "tv",
  };
};

/** Re-attach fetch after refresh; in-memory controllers are gone but Redux still says downloading. */
export const resumeInterruptedDownloads = (dispatch, downloads) => {
  for (const entry of downloads) {
    if (entry.status !== "queued" && entry.status !== "downloading") continue;
    startDownload(toDownloadItem(entry), dispatch);
  }
};
