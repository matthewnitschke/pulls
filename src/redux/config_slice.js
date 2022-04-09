const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

import { getConfig } from '../utils';

import Ajv from 'ajv';
const settingsSchema = require('../../preferences-schema.json');

const ajv = new Ajv();
const validate = ajv.compile(settingsSchema);

export const updateConfig = createAsyncThunk('updateConfig', async (arg, { rejectWithValue }) => {
  let newConfig = await getConfig();

  let isValid = validate(newConfig);

  if (!isValid) {
    return rejectWithValue(validate.errors);
  }

  return newConfig;
});

const configSlice = createSlice({
  name: 'config',
  initialState: {
    queries: [],
    errors: [],
    isValid: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateConfig.fulfilled, (state, action) => {
        let { queries, prTitleRewriter, queryInterval, githubToken, actions } = action.payload;
        state.queries = queries;
        state.queryInterval = queryInterval;
        state.prTitleRewriter = prTitleRewriter;
        state.actions = actions

        // if the githubToken starts with a $, consider it an environment var
        if (githubToken[0] == '$') {
          state.githubToken = process.env[githubToken.slice(1)];
        } else {
          state.githubToken = githubToken;
        }

        state.isValid = true;
      })
      .addCase(updateConfig.rejected, (state, action) => {
        state.isValid = false;
        state.errors = action.payload;
      });
  },
});

export default configSlice.reducer;
