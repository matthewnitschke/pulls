import { createAction, createReducer } from '@reduxjs/toolkit'

const load = createAction('queries/load')

const initialState = { value: 0 }

const queriesReducer = createReducer(initialState, (builder) => {
  builder
})

export default queriesReducer;