import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";
import { fetchPrs } from "./prs_slice";

export const setActiveQuery = (activeQueryIndex: number) => (dispatch: AppDispatch) => {
  dispatch(activeQuerySlice.actions.setActiveQuery(activeQueryIndex));
  dispatch(fetchPrs(activeQueryIndex));
};

const activeQuerySlice = createSlice({
  name: 'activeQueryIndex',
  initialState: 0,
  reducers: {
    setActiveQuery: (_, action) => action.payload,
  },
});

export default activeQuerySlice.reducer;
