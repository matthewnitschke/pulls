import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import store from './redux/store';
import { Provider } from 'react-redux';
import {
  getBackendOptions,
  MultiBackend,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { loadConfig } from './redux/config_slice';
import { loadStructure } from './redux/structure_slice';
import { fetchPrs } from './redux/prs_slice';
import { setSelectedPrs } from './redux/selected_prs_slice';
import { setFilter } from './redux/filter_slice';

store.dispatch(loadConfig());
store.dispatch(loadStructure());

window.electron.ipcRenderer.on('menubar-show', () => store.dispatch(fetchPrs(null)));
window.electron.ipcRenderer.on('menubar-hide', () => {
  store.dispatch(setSelectedPrs([]));
  store.dispatch(setFilter(''));
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <CssBaseline />
          <App />
        </DndProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
)
