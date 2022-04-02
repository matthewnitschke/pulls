import { createReducer, createAction, createAsyncThunk } from '@reduxjs/toolkit'

import {getConfig} from '../utils';

export const setActiveQuery = createAction('setActiveQuery');

export const updateFromConfig = createAsyncThunk(
  'updateFromConfig',
  async (configFilePath) => await getConfig(configFilePath)
)

const rootReducer = createReducer({
  activeQueryIndex: 0,
  queries: []
}, (builder) => {
  builder
    .addCase(
      setActiveQuery,
      (state, action) => {
        state.activeQueryIndex = action.payload
      },
    )
    .addCase(
      updateFromConfig.fulfilled,
      (state, action) => {
        state.queries = action.payload.queries;
      }
    )
})

export default rootReducer;
