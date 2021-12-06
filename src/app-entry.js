import React from 'react';
import ReactDOM from 'react-dom';

import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { createTheme, ThemeProvider } from '@mui/material/styles';

import PullsApp from './components/PullsApp.jsx';


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
    MuiMenu: {
      defaultProps: {
        MenuListProps: {
          'dense': true
        }
      },
      styleOverrides: {
        paper: {
          width: 170,
          border: 'solid 1px #444c56'
        }
      }
    },
  }
});

ReactDOM.render(
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={theme}>
          <PullsApp />
      </ThemeProvider>
    </DndProvider>,
    document.getElementById('app')
);