import React from 'react';
import { createRoot } from 'react-dom/client';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { ThemeProvider } from '@mui/material/styles';
import PullsApp from './components/PullsApp.jsx';
import ConfigValidator from './components/ConfigValidator.jsx';
import configureStore from './redux/store.js';
import { Provider } from 'react-redux';
import fs from 'fs';
import { configFilePath } from './utils.js';
import { updateConfig } from './redux/config_slice.js';
import theme from './styles/mui-theme.js';

let store = configureStore();

fs.watch(configFilePath, () => store.dispatch(updateConfig()));
store.dispatch(updateConfig());

// setInterval(() => {
//   store.dispatch(synchronizeStructure());
// }, toMils('30min')); // temporary to spike under, should be way bigger (6hrs or so)

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <DndProvider backend={HTML5Backend}>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConfigValidator>
          <PullsApp />
        </ConfigValidator>
      </ThemeProvider>
    </Provider>
  </DndProvider>
);


postMessage({ payload: 'removeLoading' }, '*')
