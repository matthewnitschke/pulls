import { createSlice } from '@reduxjs/toolkit';

import { createAsyncThunk } from '@reduxjs/toolkit';

import queryGithub from '../github_client.js';
import { selectActiveQuery } from './selectors.js';

export const refreshCurrentPrs = createAsyncThunk('refreshCurrentPrs', async (arg, { getState, dispatch }) => {
  let state = getState();
  let activeQuery = selectActiveQuery(state)

  dispatch(fetchPrs({query: activeQuery}))

  let queryObj = state.config.queries[state.activeQueryIndex];
  if ((queryObj?.children ?? 0)?.length > 0) {
    queryObj.children.forEach((childQuery) => {
      dispatch(fetchPrs({
        query: childQuery.query,
        parent: activeQuery,
      }));
    })
  }
});

export const fetchPrs = createAsyncThunk('fetchPrs', async ({ query, parent }, { getState, rejectWithValue }) => {
  try {
    let state = getState();

    if (query == null) return rejectWithValue('No Query Found');

    let resp = await queryGithub(query, state.config.githubToken);

    return resp;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchChildPrs = createAsyncThunk(
  'fetchChildPrs', 
  async ({ query, parent }, { getState, rejectWithValue }) => {
    
  }
)

const prsSlice = createSlice({
  name: 'prs',
  initialState: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrs.pending, (state, action) => {
        let { query } = action.meta.arg;
        state[query] = {
          ...state[action.meta.arg],
          status: 'loading'
        }
      })
      .addCase(fetchPrs.rejected, (state, action) => {
        let { query } = action.meta.arg;
        state[query] = {
          status: 'error',
          errorMessage: action.payload
        }
      })
      .addCase(fetchPrs.fulfilled, (state, action) => {
        let { query } = action.meta.arg;
        state[query] = {
          status: 'idle',
          data: action.payload
        }
      });
  },
});

export default prsSlice.reducer;
