import { createReducer } from '@reduxjs/toolkit'

import { setActiveQuery } from './actions.js';

const rootReducer = createReducer({}, (builder) => {
  builder.addCase(
    setActiveQuery,
    (state, action) => {
      state.activeQueryIndex = action.payload
    },
  )
})

export default rootReducer;
