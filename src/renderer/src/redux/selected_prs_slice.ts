import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { groupPrs } from "./structure_slice";

const initialState: string[] = [];

const selectedPrsSlice = createSlice({
  name: 'selectedPrs',
  initialState,
  reducers: {
    setSelectedPrs: (_, action: PayloadAction<string[]>) => action.payload,
    togglePrSelected: (state, action: PayloadAction<string>) => {
      if (state.includes(action.payload)) {
        state.splice(state.indexOf(action.payload), 1);
      } else {
        state.push(action.payload);
      }
    }
  },
  extraReducers: (builder) => builder
    .addCase(groupPrs, (_, __) => [])
});

export default selectedPrsSlice.reducer;
export const {setSelectedPrs, togglePrSelected} = selectedPrsSlice.actions;
