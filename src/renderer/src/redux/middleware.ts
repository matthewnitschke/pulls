
export const structurePersistanceMiddleware = store => next => action => {
  let initialState = store.getState();
  next(action);
  let afterState = store.getState();

  if (JSON.stringify(initialState.structure) !== JSON.stringify(afterState.structure)) {
    window.electron.ipcRenderer.invoke('set-structure', afterState.structure);
  }
};
