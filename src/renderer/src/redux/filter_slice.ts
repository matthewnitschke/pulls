import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter: (_, action: PayloadAction<string>) => action.payload,
  },
});

export default filterSlice.reducer;
export const {setFilter} = filterSlice.actions;
