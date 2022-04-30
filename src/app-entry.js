import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import PullsApp from './components/PullsApp.jsx';
import ConfigValidator from './components/ConfigValidator.jsx';
import configureStore from './redux/store.js';
import { Provider } from 'react-redux';

import fs from 'fs';
import { configFilePath } from './utils.js';

import { updateConfig } from './redux/config_slice.js';
import { synchronizeStructure } from './redux/structure_slice.js';

import toMils from 'to-mils';

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#adbac7',
    },
    secondary: {
      main: '#768390',
    },
    text: {
      primary: '#adbac7',
      secondary: '#768390',
    },
    background: {
      default: '#22272d',
      paper: '#2d333b',
    },
  },

  components: {
    MuiPopover: {
      styleOverrides: {
        paper: {
          border: 'solid 1px #444c56',
        },
      },
    },
    MuiMenu: {
      defaultProps: {
        MenuListProps: {
          dense: true,
        },
      },
      styleOverrides: {
        paper: {
          width: 170,
        },
      },
    },
  },
});

let store = configureStore();

fs.watch(configFilePath, () => store.dispatch(updateConfig()));
store.dispatch(updateConfig());

setInterval(() => {
  store.dispatch(synchronizeStructure());
}, toMils('30min')); // temporary to spike under, should be way bigger (6hrs or so)

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
