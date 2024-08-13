import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";
import { fetchPrs } from "./prs_slice";

export const setActiveRootQuery = (query: string) => (dispatch: AppDispatch) => {
  dispatch(activeRootQuery.actions.setActiveRootQuery(query));
  dispatch(fetchPrs(query));
};

const initialState: string = '';

export const activeRootQuery = createSlice({
  name: 'activeRootQuery',
  initialState,
  reducers: {
    setActiveRootQuery: (_, action) => action.payload,
  },
});
