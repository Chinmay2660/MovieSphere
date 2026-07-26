import { createSlice } from "@reduxjs/toolkit";
import { USER_MESSAGES } from "../../lib/userFriendlyError";

const STORAGE_KEY = "moviesphere_downloads_meta";

export const getDownloadKey = (item) => {
  if (item.type === "movie") return `movie-${item.id}`;
  return `tv-${item.tv_id}-s${item.season_number}-e${item.episode_number}`;
};

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items) => {
  try {
    const serializable = items.map(({ blobUrl, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch (e) {
    console.error("Failed to save downloads metadata", e);
  }
};

const initialState = loadFromStorage();

const downloadsSlice = createSlice({
  name: "downloads",
  initialState,
  reducers: {
    addDownload: (state, action) => {
      const item = action.payload;
      const key = getDownloadKey(item);
      const existing = state.findIndex((d) => d.key === key);
      const entry = {
        key,
        type: item.type,
        id: item.id ?? null,
        tv_id: item.tv_id ?? null,
        season_number: item.season_number ?? null,
        episode_number: item.episode_number ?? null,
        title: item.title ?? item.show_name ?? "Unknown",
        subtitle: item.episode_name ?? null,
        poster_path: item.poster_path ?? item.still_path ?? null,
        media_type: item.media_type ?? (item.type === "movie" ? "movie" : "tv"),
        status: "queued",
        progress: 0,
        bytesDownloaded: 0,
        totalBytes: 0,
        error: null,
        source: null,
        mimeType: null,
        format: null,
        addedAt: Date.now(),
      };
      if (existing >= 0) {
        state[existing] = { ...state[existing], ...entry };
      } else {
        state.push(entry);
      }
      saveToStorage(state);
    },
    updateDownloadProgress: (state, action) => {
      const { key, progress, bytesDownloaded, totalBytes } = action.payload;
      const item = state.find((d) => d.key === key);
      if (!item) return;
      item.status = "downloading";
      item.progress = progress;
      item.bytesDownloaded = bytesDownloaded;
      item.totalBytes = totalBytes;
    },
    setDownloadCompleted: (state, action) => {
      const { key, source, mimeType, format } = action.payload;
      const item = state.find((d) => d.key === key);
      if (!item) return;
      item.status = "completed";
      item.progress = 100;
      item.error = null;
      if (source) item.source = source;
      if (mimeType) item.mimeType = mimeType;
      if (format) item.format = format;
      saveToStorage(state);
    },
    setDownloadFailed: (state, action) => {
      const { key, error } = action.payload;
      const item = state.find((d) => d.key === key);
      if (!item) return;
      item.status = "failed";
      item.error = error ?? USER_MESSAGES.download;
      saveToStorage(state);
    },
    setDownloadCancelled: (state, action) => {
      const { key } = action.payload;
      const item = state.find((d) => d.key === key);
      if (!item) return;
      item.status = "cancelled";
      item.progress = 0;
      saveToStorage(state);
    },
    removeDownload: (state, action) => {
      const key = action.payload;
      const idx = state.findIndex((d) => d.key === key);
      if (idx >= 0) {
        state.splice(idx, 1);
        saveToStorage(state);
      }
    },
    hydrateDownloads: (state, action) => {
      return action.payload;
    },
    clearAllDownloads: (state) => {
      state.length = 0;
      saveToStorage(state);
    },
  },
});

export const {
  addDownload,
  updateDownloadProgress,
  setDownloadCompleted,
  setDownloadFailed,
  setDownloadCancelled,
  removeDownload,
  hydrateDownloads,
  clearAllDownloads,
} = downloadsSlice.actions;

export const selectDownloadByKey = (state, key) =>
  state.downloads.find((d) => d.key === key);

export const selectActiveDownloads = (state) =>
  state.downloads.filter((d) => d.status === "downloading" || d.status === "queued");

export const selectCompletedDownloads = (state) =>
  state.downloads.filter((d) => d.status === "completed");

export default downloadsSlice.reducer;
