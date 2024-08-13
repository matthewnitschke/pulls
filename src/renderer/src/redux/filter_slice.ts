import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const filter = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter: (_, action: PayloadAction<string>) => action.payload,
  },
});

export const {setFilter} = filter.actions;
