import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import activeQueryReducer from "./active_query_slice";
import selectedPrsReducer from "./selected_prs_slice";
import prsReducer from "./prs_slice";
import structureReducer from "./structure_slice";
import configReducer from "./config_slice";
import filterReducer from "./filter_slice";
import { structurePersistanceMiddleware } from "./middleware";

const store = configureStore({
  reducer: {
    config: configReducer,
    activeQueryIndex: activeQueryReducer,
    selectedPrs: selectedPrsReducer,
    prs: prsReducer,
    structure: structureReducer,
    filter: filterReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(structurePersistanceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export default store;
