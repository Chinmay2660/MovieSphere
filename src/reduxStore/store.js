import { configureStore } from '@reduxjs/toolkit'
import movieReducer from './Reducer/movieSlice'
import watchlistReducer from './Reducer/watchlistSlice'

export const store = configureStore({
  reducer: {
    movieData: movieReducer,
    watchlist: watchlistReducer,
  },
})