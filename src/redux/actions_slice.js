
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import swal from 'sweetalert';
import { githubRequest } from '../github_client';
import { selectActiveQuery } from './selectors';

export const executeAction = createAsyncThunk(
  'executeAction',
  async ({ actionKey, itemId }, { rejectWithValue, dispatch, getState }) => {
    let state = getState();

    let action = state.config.actions[actionKey];

    let url = action.url;
    let method = action.method;
    let body = action.body;

    let activeQuery = selectActiveQuery(state);

    // item is a pull request
    if (state.prs.data[activeQuery].hasOwnProperty(itemId)) {
      let pr = state.prs.data[activeQuery][itemId];
      url = url.replace('${owner}', pr.org);
      url = url.replace('${repo}', pr.repo);
      url = url.replace('${pull_number}', pr.pull);
    }

    try {
      let res = await githubRequest({
        path: url,
        method,
        body,
      }, state.config.githubToken);

      if (action.refreshAfterRun) {
        dispatch(fetchPrs())
      }

      return res;
    } catch (e) {
      swal("Action Failed", e.message, "error");
    }
  }
);

const actionsSlice = createSlice({
  name: 'actions',
  initialState: {},
  extraReducers: builder => {
    builder
      .addCase(executeAction.pending, (state, action) => {
        let {itemId, actionKey} = action.meta.arg;
        state[itemId] = {
          ...state[itemId],
          [actionKey]: {
            status: 'running',
          }
        }
      })
      .addCase(executeAction.fulfilled, (state, action) => {
        let {itemId, actionKey} = action.meta.arg;
        delete state[itemId][actionKey]
      })
  }
})

export default actionsSlice.reducer;
