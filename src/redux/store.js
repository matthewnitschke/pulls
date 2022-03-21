import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root_reducer.js';
import prsSlice from './prs_slice.js';

export default function getStore(preloadedState) {
  return configureStore({
    reducer: (state, action) => {
      let newState = rootReducer(state, action)

      return {
        ...newState,
        prs: prsSlice.reducer(newState.prs, action)
      }
    },
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState
  })
}