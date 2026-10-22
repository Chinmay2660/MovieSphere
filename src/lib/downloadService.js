import {
  addDownload,
  updateDownloadProgress,
  setDownloadCompleted,
  setDownloadFailed,
  setDownloadCancelled,
  getDownloadKey,
} from "../reduxStore/Reducer/downloadsSlice";
import { createDownloadSink, deleteBlob } from "./downloadStorage";
import { buildDownloadPath, fetchDownloadAvailability } from "./mediaApiUrls";
import { toUserMessage, USER_MESSAGES } from "./userFriendlyError";

const activeControllers = new Map();
const DOWNLOAD_TIMEOUT_MS = 2 * 60 * 60 * 1000;

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

  let downloadUrl;
  try {
    downloadUrl = buildDownloadPath(item);
  } catch (error) {
    dispatch(addDownload(item));
    dispatch(setDownloadFailed({ key, error: toUserMessage(error, "download") }));
    return;
  }

  let availability = { available: true };
  try {
    availability = await fetchDownloadAvailability(item);
  } catch {
    // If the probe fails, still try the full download.
  }

  dispatch(addDownload(item));
  dispatch(updateDownloadProgress({ key, progress: 0, bytesDownloaded: 0, totalBytes: 0 }));

  if (!availability.available) {
    dispatch(
      setDownloadFailed({
        key,
        error: USER_MESSAGES.downloadEmbedOnly,
      })
    );
    return;
  }

  const controller = new AbortController();
  activeControllers.set(key, controller);
  const timeoutId = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);

  let sink;
  try {
    sink = await createDownloadSink(key);
  } catch (error) {
    dispatch(setDownloadFailed({ key, error: toUserMessage(error, "download") }));
    return;
  }

  try {
    const response = await fetch(downloadUrl, {
      signal: controller.signal,
      credentials: "same-origin",
      cache: "no-store",
      redirect: "error",
    });
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

    let bytesDownloaded = 0;

    if (source) {
      dispatch(updateDownloadProgress({ key, progress: 0, bytesDownloaded: 0, totalBytes, source }));
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      await sink.write(value);
      bytesDownloaded += value.length;
      const progress = totalBytes > 0 ? Math.round((bytesDownloaded / totalBytes) * 100) : 0;
      dispatch(updateDownloadProgress({ key, progress, bytesDownloaded, totalBytes, source: source ?? undefined }));
    }

    await sink.close(contentType);
    dispatch(setDownloadCompleted({ key, source, mimeType: contentType, format }));
  } catch (error) {
    if (error.name === "AbortError") {
      dispatch(setDownloadCancelled({ key }));
      await sink?.abort?.().catch(() => {});
      await deleteBlob(key).catch(() => {});
    } else {
      await sink?.abort?.().catch(() => {});
      await deleteBlob(key).catch(() => {});
      dispatch(setDownloadFailed({ key, error: toUserMessage(error, "download") }));
    }
  } finally {
    clearTimeout(timeoutId);
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
