import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  bannerData: [],
  imageURL: '',
  upcomingData: [],
  topRatedData: [],
  nowPlayingData: []
}

export const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setBannerData: (state, action) => {
      state.bannerData = action.payload
    },
    setImageURL: (state, action) => {
      state.imageURL = action.payload
    },
    setUpcomingData: (state, action) => {
      state.upcomingData = action.payload
    },
    setTopRatedData: (state, action) => {
      state.topRatedData = action.payload
    },
    setNowPlayingData: (state, action) => {
      state.nowPlayingData = action.payload
    },
  },
})

export const { setBannerData, setImageURL, setUpcomingData, setTopRatedData, setNowPlayingData } = movieSlice.actions

export default movieSlice.reducer