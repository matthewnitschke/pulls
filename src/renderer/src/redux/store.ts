import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import {activeRootQuery} from "./active_root_query_slice";
import {selectedPrs} from "./selected_prs_slice";
import {prs} from "./prs_slice";
import {structure} from "./structure_slice";
import { config } from "./config_slice";
import { filter } from "./filter_slice";
import { structurePersistanceMiddleware } from "./middleware";

const store = configureStore({
  reducer: {
    config: config.reducer,
    activeRootQuery: activeRootQuery.reducer,
    selectedPrs: selectedPrs.reducer,
    prs: prs.reducer,
    structure: structure.reducer,
    filter: filter.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(structurePersistanceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export default store;
