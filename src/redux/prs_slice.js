import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import queryGithub from '../github_client.js';


export const fetchPrs = createAsyncThunk(
  'prs/fetch',
  async (query, { rejectWithValue }) => {
    try {
      let resp = await queryGithub(query)
      return resp;
    } catch (err) {
      console.error(err);
      rejectWithValue(err);
    }
  }
)

const prsSlice = createSlice({
  name: 'prs',
  initialState: { data: {}, status: 'idle' },
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

export default prsSlice;
