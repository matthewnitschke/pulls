import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import queryGithub from "@renderer/utils/github_client";
import { RootState } from "./store";

export interface PullData {
  id: string

  org: string
  repo: string
  pull: number

  state: 'closed' | 'open' | 'merged'
  status: 'success' | 'pending' | 'failure' | 'no-status-found'
  name: string
  url: string
}

export const fetchPrs = createAsyncThunk<
{ [query: string]: {[id: string]: PullData} },
  string | null,
  { rejectValue: string }
>(
  'fetchPrs',
  async (query, { getState, rejectWithValue }) => {
    let state = getState() as RootState;
    try {
      let q = query ?? state.activeRootQuery ?? state.config.data.queries[0].query;
      let res = await queryGithub([q], state.config.data?.githubToken ?? '');
      return res;
    } catch (err) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('error');
    }
  },
);

type PrsSliceState = {
  data: {[query: string]: {[id: string]: PullData}},
  status: 'idle' | 'loading' | 'error',
  errorMessage?: string,
};

const initialState: PrsSliceState = {
  data: {},
  status: 'idle',
}

export const prs = createSlice({
  name: 'prs',
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchPrs.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchPrs.rejected, (state, action) => {
      state.status = 'error';
      state.errorMessage = action.payload;
    })
    .addCase(fetchPrs.fulfilled, (state, action) => {
      state.status = 'idle';

      for (let [query, prs] of Object.entries(action.payload)) {
        state.data[query] = prs;
      }
    })
});
