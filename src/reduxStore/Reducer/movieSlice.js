import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  bannerData: []
}

export const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setBannerData: (state, action) => {
      state.bannerData = action.payload
    }
  },
})

export const { setBannerData } = movieSlice.actions

export default movieSlice.reducer