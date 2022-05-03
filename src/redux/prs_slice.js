import { createSlice } from '@reduxjs/toolkit';

import { createAsyncThunk } from '@reduxjs/toolkit';

import queryGithub from '../github_client.js';
import { selectActiveQuery } from './selectors.js';

export const fetchPrs = createAsyncThunk('fetchPrs', async (arg, { getState, rejectWithValue }) => {
  try {
    let state = getState();
    
    let activeQuery = selectActiveQuery(state);
    if (activeQuery == null) return rejectWithValue('No Query Found');
    
    let resp = await queryGithub(activeQuery, state.config.githubToken);
    
    return { resp, activeQuery };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

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
        state.status = 'loading';
      })
      .addCase(fetchPrs.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.payload;
      })
      .addCase(fetchPrs.fulfilled, (state, action) => {
        state.status = 'loaded';

        // use activeQuery from payload instead of meta to ensure the correct active query is used
        state.data[action.payload.activeQuery] = action.payload.resp;
      });
  },
});

export default prsSlice.reducer;
