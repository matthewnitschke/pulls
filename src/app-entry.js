import React from 'react';
import ReactDOM from 'react-dom';

import PullsApp from './components/PullsApp.jsx';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#adbac7',
    },
    secondary: {
      main: '#f50057',
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
    <ThemeProvider theme={theme}>
        <PullsApp />
    </ThemeProvider>,
    document.getElementById('app')
);