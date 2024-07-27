import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ConfigSchema } from "../../../main/config";

export const loadConfig = createAsyncThunk<
  ConfigSchema,
  void,
  { rejectValue: string[] }
>(
  'loadConfig',
  async (_, { rejectWithValue }) => {
    try {
     return await window.electron.ipcRenderer.invoke('get-config');
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

const configSlice = createSlice({
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


export default configSlice.reducer;
