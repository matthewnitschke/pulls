import { createAction, createAsyncThunk } from '@reduxjs/toolkit'

import githubClient from '../github_client.js';

export const fetchPrs = createAsyncThunk(
  'prs/fetch',
  async (query) => {
    const response = await githubClient.query(query)
    return response.data
  }
)

const initialState = { prs: {}, status: 'idle' }

export default prsSlice = createSlice({
  name: 'prs',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrs.pending, (state) => state.status = 'loading')
      .addCase(fetchPrs.rejected, (state) => state.status = 'error')
      .addCase(fetchPrs.fulfilled, (state, action) => {
        state.prs[action.query] = action.payload
      })
  }
})