import { createAction } from '@reduxjs/toolkit'

export const setActiveQuery = createAction('root/setActiveQuery');

export default function rootReducer(state, action) {
  switch (action.type) {
    case 'root/setActiveQuery':
      return { 
        ...state,
        activeQueryIndex: action.payload,
      }
    default:
      return state
  }
}
