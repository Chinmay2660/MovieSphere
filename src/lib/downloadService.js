import {
  addDownload,
  updateDownloadProgress,
  setDownloadCompleted,
  setDownloadFailed,
  setDownloadCancelled,
  getDownloadKey,
} from "../reduxStore/Reducer/downloadsSlice";
import { saveBlob, deleteBlob } from "./downloadStorage";
import { toUserMessage } from "./userFriendlyError";

const activeControllers = new Map();

const buildDownloadUrl = (item) => {
  const title = encodeURIComponent(item.title ?? item.show_name ?? "video");
  if (item.type === "movie") {
    return `/api/download/movie/${item.id}?title=${title}`;
  }
  return `/api/download/tv/${item.tv_id}/${item.season_number}/${item.episode_number}?title=${title}`;
};

const formatBytes = (bytes) => {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

export { formatBytes };

export const startDownload = async (item, dispatch) => {
  const key = getDownloadKey(item);
  if (activeControllers.has(key)) return;

  dispatch(addDownload(item));
  dispatch(updateDownloadProgress({ key, progress: 0, bytesDownloaded: 0, totalBytes: 0 }));

  const controller = new AbortController();
  activeControllers.set(key, controller);

  try {
    const response = await fetch(buildDownloadUrl(item), { signal: controller.signal });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error ?? errBody.message ?? "download failed");
    }

    const totalBytes = Number(response.headers.get("Content-Length")) || 0;
    const source = response.headers.get("X-Download-Source");
    const format = response.headers.get("X-Download-Format");
    const contentType = response.headers.get("Content-Type") || "video/mp4";
    const reader = response.body?.getReader();
    if (!reader) throw new Error("streaming not supported");

    const chunks = [];
    let bytesDownloaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      bytesDownloaded += value.length;
      const progress = totalBytes > 0 ? Math.round((bytesDownloaded / totalBytes) * 100) : 0;
      dispatch(updateDownloadProgress({ key, progress, bytesDownloaded, totalBytes }));
    }

    const blob = new Blob(chunks, { type: contentType });
    await saveBlob(key, blob);
    dispatch(setDownloadCompleted({ key, source, mimeType: contentType, format }));
  } catch (error) {
    if (error.name === "AbortError") {
      dispatch(setDownloadCancelled({ key }));
      await deleteBlob(key).catch(() => {});
    } else {
      dispatch(setDownloadFailed({ key, error: toUserMessage(error, "download") }));
    }
  } finally {
    activeControllers.delete(key);
  }
};

export const cancelDownload = (key, dispatch) => {
  const controller = activeControllers.get(key);
  if (controller) {
    controller.abort();
    activeControllers.delete(key);
  }
  dispatch(setDownloadCancelled({ key }));
};

export const removeDownloadData = async (key, dispatch, removeDownload) => {
  const controller = activeControllers.get(key);
  if (controller) controller.abort();
  await deleteBlob(key).catch(() => {});
  dispatch(removeDownload(key));
};
