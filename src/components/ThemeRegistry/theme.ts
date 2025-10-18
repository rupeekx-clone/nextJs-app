import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#208DDC',      // Blue from logo
      light: '#52A8E8',     // Lighter blue shade
      dark: '#1A6FB0',      // Darker blue shade
      contrastText: '#fff',
    },
    secondary: {
      main: '#20DCD5',      // Cyan from logo
      light: '#52E8E1',     // Lighter cyan shade
      dark: '#1AB0A9',      // Darker cyan shade
      contrastText: '#fff',
    },
    error: {
      main: red.A400,
      light: '#ff6659',
      dark: '#b2102f',
      contrastText: '#fff',
    },
    // Custom palette extension for ternary color
    ternary: {
      main: '#208DDC',      // Match primary blue
      light: '#52A8E8',
      dark: '#1A6FB0',
      contrastText: '#fff',
    },
    // Custom palette extension for alternate color
    alternate: {
      main: '#f7f9fc',      // light neutral background (unchanged)
      light: '#ffffff',
      dark: '#e3e6eb',
      contrastText: '#171717',
    },
  },
  typography: {
    fontFamily: [
      'var(--font-geist-sans)',
      'var(--font-geist-mono)',
      'sans-serif',
      'monospace',
    ].join(','),
    fontSize: 16, // base font size in px
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      fontSize: '1rem',
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        color: 'primary',
      },
    },
  },
});

export default theme;
