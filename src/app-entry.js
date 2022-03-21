import React from 'react';
import ReactDOM from 'react-dom';

import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { createTheme, ThemeProvider } from '@mui/material/styles';

import PullsApp from './components/PullsApp.jsx';
import configureStore from './redux/store.js';
import { Provider } from 'react-redux'


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
        }
      }
    },
    MuiMenu: {
      defaultProps: {
        MenuListProps: {
          'dense': true
        }
      },
      styleOverrides: {
        paper: {
          width: 170,
        }
      }
    },
  }
});

let store = configureStore({
  activeQueryIndex: 0,
  queryStatus: 'running',

  queries: [
    {
      label: 'My PRs',
      query: 'is:open is:pr author:{githubUser} archived:false'
    },
    {
      label: 'Assigned PRs',
      query: 'is:open is:pr team-review-requested:Workiva/ir-platform'
    }
  ],

  prs: {},

  structure: {
    'is:open is:pr author:{githubUser} archived:false': [
      'uuid'
    ]
  }
});

ReactDOM.render(
    <DndProvider backend={HTML5Backend}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
            <PullsApp />
        </ThemeProvider>
      </Provider>
    </DndProvider>,
    document.getElementById('app')
);