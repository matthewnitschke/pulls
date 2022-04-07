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
        state.errorMessage = action.payload;
      })
      .addCase(fetchPrs.fulfilled, (state, action) => {
        state.status = 'loaded'

        // use activeQuery from payload instead of meta to ensure the correct active query is used
        state.data[action.payload.activeQuery] = action.payload.resp
      })
  }
})

export default prsSlice.reducer;
