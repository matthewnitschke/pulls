import { createReducer, createAction, createAsyncThunk } from '@reduxjs/toolkit'

import { getConfig } from '../utils';
import { fetchPrs } from './actions';

export const setActiveQuery = activeQueryIndex => dispatch => {
  dispatch(setActiveQueryInt(activeQueryIndex))
  dispatch(fetchPrs());
}

/// Internal version of setActiveQuery, only updates the reducer
const setActiveQueryInt = createAction('setActiveQuery');

export const updateFromConfig = createAsyncThunk(
  'updateFromConfig',
  async () => await getConfig()
)

const rootReducer = createReducer({
  activeQueryIndex: 0,
  queries: []
}, (builder) => {
  builder
    .addCase(
      setActiveQueryInt,
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
