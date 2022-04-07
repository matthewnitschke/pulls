import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./root_reducer";
import prsReducer from "./prs_slice";
import structureReducer from "./structure_slice";
import selectedItemIdsReducer from "./selected_item_ids_slice";
import configReducer from "./config_slice";

import {
  activeQueryInjectorMiddleware,
  structurePersistanceMiddleware,
} from "./middleware";

export default function getStore(preloadedState) {
  return configureStore({
    reducer: (state, action) => {
      let newState = rootReducer(state, action);

      return {
        ...newState,
        config: configReducer(newState.config, action),
        selectedItemIds: selectedItemIdsReducer(
          newState.selectedItemIds,
          action
        ),
        prs: prsReducer(newState.prs, action),
        structure: structureReducer(newState.structure, action),
      };
    },
    devTools: process.env.NODE_ENV !== "production",
    preloadedState,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      activeQueryInjectorMiddleware,
      structurePersistanceMiddleware,
    ],
  });
}
