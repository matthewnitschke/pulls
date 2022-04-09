import { createAsyncThunk } from '@reduxjs/toolkit';
import { githubRequest } from '../github_client';

export const executeAction = createAsyncThunk(
  'executeAction',
  async ({ actionKey, itemId }, { rejectWithValue, getState }) => {
    let state = getState();

    let action = state.config.actions[actionKey];

    let url = action.url;
    let method = action.method;
    let body = action.body;

    // item is a pull request
    if (state.prs.hasOwnProperty(itemId)) {
      let pr = state.prs[itemId];
      url = url.replace('${owner}', pr.org);
      url = url.replace('${repo}', pr.repo);
      url = url.replace('${pull_number}', pr.pull);
    }

    try {
      return await githubRequest({
        path: url,
        method,
        body,
      });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

// const actionsSlice = createSlice({
//   name: 'actions',
//   initialState: {},
//   extraReducers: builder => {
//     builder
//       .addCase(executeAction.pending, (state, action) => {

//       })
//   }
// })

// export default actionsSlice.reducer;
