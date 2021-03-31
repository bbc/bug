import { createMuiTheme }  from '@material-ui/core/styles'
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
        minWidth: "34px !important"
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

    // --- colors ---
    menu: { 
      main: '#163550' 
    },

    primary: { 
      main: '#337ab7' 
    },

    secondary: { 
      main: '#000000' 
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