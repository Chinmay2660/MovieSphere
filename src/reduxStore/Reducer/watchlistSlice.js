import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "moviesphere_watchlist";

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save watchlist", e);
  }
};

const sameMovie = (a, b) =>
  a.type === "movie" && b.type === "movie" && a.id === b.id;

const sameEpisode = (a, b) =>
  a.type === "episode" &&
  b.type === "episode" &&
  a.tv_id === b.tv_id &&
  a.season_number === b.season_number &&
  a.episode_number === b.episode_number;

const findIndex = (state, item) => {
  if (item.type === "movie") {
    return state.findIndex((i) => sameMovie(i, item));
  }
  return state.findIndex((i) => sameEpisode(i, item));
};

const initialState = loadFromStorage();

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addToWatchlist: (state, action) => {
      const item = action.payload;
      if (findIndex(state, item) >= 0) return;
      state.push(item);
      saveToStorage(state);
    },
    removeFromWatchlist: (state, action) => {
      const item = action.payload;
      const idx = findIndex(state, item);
      if (idx >= 0) {
        state.splice(idx, 1);
        saveToStorage(state);
      }
    },
    toggleWatchlist: (state, action) => {
      const item = action.payload;
      const idx = findIndex(state, item);
      if (idx >= 0) {
        state.splice(idx, 1);
      } else {
        state.push(item);
      }
      saveToStorage(state);
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, toggleWatchlist } =
  watchlistSlice.actions;

export const createList = () => ({ type: "watchlist/noop" });

export const isInWatchlist = (state, item) => findIndex(state.watchlist, item) >= 0;

export default watchlistSlice.reducer;
