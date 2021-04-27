import { createMuiTheme }  from '@material-ui/core/styles'
const defaultTheme = createMuiTheme();
const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: '8px 12px',
        borderBottom: '1px solid #181818'
      },
    },
    MuiMenuItem: {
      root: {
        color: props => (props.disabled ? "#888" : "#ffffff")
      }
    },
    MuiListItemIcon: {
      root: {
        color: props => (props.disabled ? "#888" : "#ffffff"),
      }
    },
    MuiToolbar: {
      gutters: {
        [defaultTheme.breakpoints.up('sm')]: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
      root: {
        "& .MuiButton-outlinedPrimary": {
          color: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          marginRight: '0.5rem'
        }
      }
    },
    MuiCard: {
      root: {
        borderRadius: 0
      }
    },
  },
  typography: {
    fontFamily: [
      'ReithSans'
    ],
    serviceState: {
      opacity: 0.5
    }
  },
  palette: {
    type: 'dark',

    background: { 
      default: '#181818',
      paper: '#262626'
    },

    appbar: {
      default: '#212121'
    },

    // --- colors ---
    menu: { 
      main: '#163550' 
    },

    primary: { 
      main: '#337ab7' 
    },

    secondary: { 
      main: '#888888' 
    },

    success: {
      main: '#05990c'
    },

    error: {
      main: '#f11d1d'
    },

  },
})
export default theme