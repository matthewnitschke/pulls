
import { settingsStore } from '../utils.js';

export const activeQueryInjectorMiddleware = store => next => action => {
  let state = store.getState();

  action.meta = {...action.meta, activeQuery: state.queries[state.activeQueryIndex]?.query}

  next(action);
}

export const structurePersistanceMiddleware = store => next => action => {
  let initialState = store.getState();
  next(action);
  let afterState = store.getState();

  // TODO: LOL FIND A BETTER SOLUTION
  if (JSON.stringify(initialState.structure) !== JSON.stringify(afterState.structure)) {
    settingsStore.set('structure', afterState.structure);
  }
}
