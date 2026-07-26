import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  bannerData: [],
  imageURL: '',
  upcomingData: [],
  popularMoviesData: [],
  popularTvData: [],
  nowPlayingData: [],
  topRatedMovies: [],
  topRatedTv: [],
  trendingMovies: [],
  trendingTv: [],
  airingToday: [],
  onTheAir: [],
  bollywoodData: [],
  marathiMoviesData: [],
  englishMoviesData: [],
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
      const url = action.payload
      state.imageURL =
        typeof import.meta !== 'undefined' &&
        import.meta.env?.DEV &&
        url.startsWith('https://image.tmdb.org')
          ? url.replace('https://image.tmdb.org', '/tmdb-images')
          : url
    },
    setUpcomingData: (state, action) => {
      state.upcomingData = action.payload
    },
    setPopularMoviesData: (state, action) => {
      state.popularMoviesData = action.payload
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
    setBollywoodData: (state, action) => {
      state.bollywoodData = action.payload
    },
    setMarathiMoviesData: (state, action) => {
      state.marathiMoviesData = action.payload
    },
    setEnglishMoviesData: (state, action) => {
      state.englishMoviesData = action.payload
    },
    setGenres: (state, action) => {
      state.genres[action.payload.type] = action.payload.genres
    },
    resetMovieData: () => initialState,
  },
})

export const { 
  setBannerData, 
  setImageURL, 
  setUpcomingData, 
  setPopularMoviesData,
  setPopularTvData, 
  setNowPlayingData,
  setTopRatedMovies,
  setTopRatedTv,
  setTrendingMovies,
  setTrendingTv,
  setAiringToday,
  setOnTheAir,
  setBollywoodData,
  setMarathiMoviesData,
  setEnglishMoviesData,
  setGenres,
  resetMovieData,
} = movieSlice.actions

export default movieSlice.reducer
