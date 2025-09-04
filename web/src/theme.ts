import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // A nice shade of indigo
    },
    secondary: {
      main: '#ff4081', // A vibrant pink
    },
    background: {
      default: '#f5f5f5', // Light grey for a clean look
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#3f51b5', // Use primary color for app bar
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Keep button text as is
        },
      },
    },
  },
});

export default theme;
