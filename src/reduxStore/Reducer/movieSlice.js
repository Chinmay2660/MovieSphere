import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  bannerData: [],
  imageURL: '',
  upcomingData: [],
  popularTvData: [],
  nowPlayingData: [],
  topRatedMovies: [],
  topRatedTv: [],
  trendingMovies: [],
  trendingTv: [],
  airingToday: [],
  onTheAir: [],
  genres: {
    movie: [],
    tv: []
  }
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
    setTopRatedMovies: (state, action) => {
      state.topRatedMovies = action.payload
    },
    setTopRatedTv: (state, action) => {
      state.topRatedTv = action.payload
    },
    setTrendingMovies: (state, action) => {
      state.trendingMovies = action.payload
    },
    setTrendingTv: (state, action) => {
      state.trendingTv = action.payload
    },
    setAiringToday: (state, action) => {
      state.airingToday = action.payload
    },
    setOnTheAir: (state, action) => {
      state.onTheAir = action.payload
    },
    setGenres: (state, action) => {
      state.genres[action.payload.type] = action.payload.genres
    }
  },
})

export const { 
  setBannerData, 
  setImageURL, 
  setUpcomingData, 
  setPopularTvData, 
  setNowPlayingData,
  setTopRatedMovies,
  setTopRatedTv,
  setTrendingMovies,
  setTrendingTv,
  setAiringToday,
  setOnTheAir,
  setGenres
} = movieSlice.actions

export default movieSlice.reducer
