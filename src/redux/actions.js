import { createAction, createAsyncThunk } from '@reduxjs/toolkit'

import queryGithub from '../github_client.js';
import { selectActiveQuery } from './selectors.js';

export const fetchPrs = createAsyncThunk(
  'fetchPrs',
  async (query, { getState, rejectWithValue }) => {
    try {
      let resp = await queryGithub(query ?? selectActiveQuery(getState()))
      return resp;
    } catch (err) {
      console.error(err);
      rejectWithValue(err);
    }
  }
)

export const setActiveQuery = createAction('setActiveQuery');
