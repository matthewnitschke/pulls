import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: 'dark',
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

  typography: {
    fontSize: 13,
    fontWeightRegular: 600,
    fontFamily: 'Noto Sans',
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          margin: 0,
          padding: 0
        },
        "html, body, #root": {
          height: "100%",
        },
        ul: {
          listStyle: "none"
        }
      }
    },

    MuiDialog: {
      defaultProps: {
        PaperProps: {
          elevation: 0,
        }
      },
      styleOverrides: {
        paper: {
          backgroundColor: '#2d333b',
          border: 'solid 1px #444c56',
        }
      }
    },


    MuiToolbar: {
      defaultProps: { variant: "dense" },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: {
          verticalAlign: "middle",
          color: '#768390',
        }
      }
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: { minWidth: '35px' }
      }
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          paddingLeft: '8px'
        }
      }
    },

    MuiPopover: {
      defaultProps: {
        elevation: 0,
      },
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
    },
  }
});
