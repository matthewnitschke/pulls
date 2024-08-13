import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ConfigSchema } from "../../../main/config";
import { setActiveRootQuery } from "./active_root_query_slice";
import { AppDispatch, RootState } from "./store";

export const loadConfig = createAsyncThunk<
  ConfigSchema,
  void,
  {
    rejectValue: string[],
    dispatch: AppDispatch
  }
>(
  'loadConfig',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      let config: ConfigSchema = await window.electron.ipcRenderer.invoke('get-config');

      let state = getState() as RootState;
      if (!state.activeRootQuery) {
        dispatch(setActiveRootQuery(config.queries[0].query));
      }

      return config;
    } catch(e) {
      if (e instanceof Error) return rejectWithValue([e.message]);
      return rejectWithValue([String(e)])
    }
  }
);

type ConfigSliceState = {
  data: ConfigSchema;
  errors: string[];
  isValid: boolean;
}

const initialState: ConfigSliceState = {
  data: {
    githubToken: '',
    queries: [],
  },
  errors: [],
  isValid: true,
}

export const config = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(loadConfig.fulfilled, (state, action) => {
      state.data = action.payload;
      state.errors = [];
      state.isValid = true;
    })
})
