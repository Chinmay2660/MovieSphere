import { createSlice } from '@reduxjs/toolkit';
import { getStoredRegion, REGION_STORAGE_KEY } from '../../lib/regions';
import { setRequestRegion } from '../../lib/locale';

const STORAGE_KEY = 'moviesphere_settings';

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      autoPlayFromWatchlist: parsed.autoPlayFromWatchlist ?? true,
      region: getStoredRegion(),
    };
  } catch {
    return { autoPlayFromWatchlist: true, region: getStoredRegion() };
  }
};

const saveToStorage = (settings) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ autoPlayFromWatchlist: settings.autoPlayFromWatchlist })
    );
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

const initialState = loadFromStorage();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setAutoPlayFromWatchlist: (state, action) => {
      state.autoPlayFromWatchlist = action.payload;
      saveToStorage(state);
    },
    setRegion: (state, action) => {
      state.region = action.payload;
      localStorage.setItem(REGION_STORAGE_KEY, action.payload);
      setRequestRegion(action.payload);
    },
  },
});

export const { setAutoPlayFromWatchlist, setRegion } = settingsSlice.actions;

export const selectAutoPlayFromWatchlist = (state) =>
  state.settings.autoPlayFromWatchlist;

export const selectRegion = (state) => state.settings.region;

export default settingsSlice.reducer;
