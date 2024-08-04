import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  bannerData: [],
  imageURL: '',
  upcomingData: [],
  popularTvData: [],
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
    setPopularTvData: (state, action) => {
      state.popularTvData = action.payload
    },
    setNowPlayingData: (state, action) => {
      state.nowPlayingData = action.payload
    },
  },
})

export const { setBannerData, setImageURL, setUpcomingData, setPopularTvData, setNowPlayingData } = movieSlice.actions

export default movieSlice.reducer