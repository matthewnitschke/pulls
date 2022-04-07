import { createAsyncThunk } from '@reduxjs/toolkit'

import queryGithub from '../github_client.js';
import { selectActiveQuery } from './selectors.js';

export const fetchPrs = createAsyncThunk(
  'fetchPrs',
  async (arg, { getState, rejectWithValue }) => {
    try {
      let state = getState();
      
      let activeQuery = selectActiveQuery(state);
      if (activeQuery == null) return rejectWithValue('No Query Found')

      let resp = await queryGithub(activeQuery, state.config.githubToken)

      return { resp, activeQuery };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
)
