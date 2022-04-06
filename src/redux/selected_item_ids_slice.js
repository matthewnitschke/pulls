import { createSlice } from "@reduxjs/toolkit";

const selectedItemIdsSlice = createSlice({
  name: 'selectedItemIds',
  initialState: [],
  reducers: {
    toggleItemSelection: (state, action) => {
      let itemId = action.payload;

      if (state.includes(itemId)) {
        state.splice(state.indexOf(itemId), 1)
      } else {
        state.push(itemId)
      }
    },
    clearSelection: (state) => {
      state = []
    }
  }
});

export default selectedItemIdsSlice.reducer;
export const { toggleItemSelection, clearSelection } = selectedItemIdsSlice.actions;
