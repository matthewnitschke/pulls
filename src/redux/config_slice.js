const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

import { getConfig } from '../utils';

import Ajv from 'ajv';
const settingsSchema = require('../../preferences-schema.json');

const ajv = new Ajv({ useDefaults: true });
const validate = ajv.compile(settingsSchema);

export const updateConfig = createAsyncThunk('updateConfig', async (arg, { rejectWithValue }) => {
  let newConfig = await getConfig();

  let isValid = validate(newConfig);

  if (!isValid) {
    return rejectWithValue(validate.errors);
  }

  return newConfig;
});

// validate empty object to apply defaults for initialState
let initialState = {};
validate(initialState);

const configSlice = createSlice({
  name: 'config',
  initialState: {
    ...initialState,
    errors: [],
    isValid: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateConfig.fulfilled, (state, action) => {

        // if the githubToken starts with a $, consider it an environment var
        let githubToken = action.payload.githubToken;
        if (githubToken[0] == '$') {
          githubToken = process.env[githubToken.slice(1)];
        }

        state.isValid = true;

        return {
          ...action.payload,
          githubToken,
          isValid: true
        }
      })
      .addCase(updateConfig.rejected, (state, action) => {
        state.isValid = false;
        state.errors = action.payload;
      });
  },
});

export default configSlice.reducer;
