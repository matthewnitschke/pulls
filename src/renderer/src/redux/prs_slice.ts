import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import queryGithub from "@renderer/clients/github_client";
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
  number,
  { rejectValue: string }
>(
  'fetchPrs',
  async (queryIndex, { getState, rejectWithValue }) => {
    try {
      let state = getState() as RootState;

      let query = state.config.data.queries[queryIndex].query;
      let res = await queryGithub([query], state.config.data?.githubToken ?? '');

      return res;
    } catch (err) {
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

const prsSlice = createSlice({
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

export default prsSlice.reducer;
