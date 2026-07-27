import { configureStore } from '@reduxjs/toolkit'
import movieReducer from './Reducer/movieSlice'
import watchlistReducer from './Reducer/watchlistSlice'
import downloadsReducer from './Reducer/downloadsSlice'

export const store = configureStore({
  reducer: {
    movieData: movieReducer,
    watchlist: watchlistReducer,
    downloads: downloadsReducer,
  },
})
