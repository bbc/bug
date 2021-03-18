import { createMuiTheme }  from '@material-ui/core/styles'
const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'ReithSans'
    ],
  },
  palette: {
    type: 'dark',

    background: { 
      default: '#181818',
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
  },
})
export default theme