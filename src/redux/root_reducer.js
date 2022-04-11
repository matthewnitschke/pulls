import { createReducer, createAction } from '@reduxjs/toolkit';

import { refreshCurrentPrs } from './prs_slice';

export const setActiveQuery = (activeQueryIndex) => (dispatch) => {
  dispatch(setActiveQueryInt(activeQueryIndex));
  dispatch(refreshCurrentPrs());
};

/// Internal version of setActiveQuery, only updates the reducer
const setActiveQueryInt = createAction('setActiveQuery');

const rootReducer = createReducer(
  {
    activeQueryIndex: 0,
  },
  (builder) => {
    builder
      .addCase(setActiveQueryInt, (state, action) => {
        state.activeQueryIndex = action.payload;
      });
  }
);

export default rootReducer;
