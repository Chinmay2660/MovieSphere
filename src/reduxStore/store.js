import { configureStore } from '@reduxjs/toolkit'
import movieReducer from './Reducer/movieSlice'

export const store = configureStore({
  reducer: {
    movieData: movieReducer
  },
})