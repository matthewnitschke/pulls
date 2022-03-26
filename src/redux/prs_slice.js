import { createSlice } from '@reduxjs/toolkit'

import { fetchPrs } from './actions';

const prsSlice = createSlice({
  name: 'prs',
  initialState: { 
    data: {},
    structure: {},
    status: 'idle',
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrs.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPrs.rejected, (state, action) => {
        state.status = 'error'
      })
      .addCase(fetchPrs.fulfilled, (state, action) => {
        state.status = 'loaded'
        state.data[action.meta.arg] = action.payload
      })
  }
})

export default prsSlice.reducer;
