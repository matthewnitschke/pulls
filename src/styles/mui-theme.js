import { createTheme } from '@mui/material/styles';

export default createTheme({
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
          width: 180,
        },
      },
    },
  },
})
