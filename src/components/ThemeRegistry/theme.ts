import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#ef7f1a',
      light: '#ff9b47',
      dark: '#b95e12',
      contrastText: '#fff',
    },
    secondary: {
      main: '#19857b',
      light: '#4caf94',
      dark: '#005f56',
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
      main: '#ff9800',
      light: '#ffc947',
      dark: '#c66900',
      contrastText: '#fff',
    },
    // Custom palette extension for alternate color
    alternate: {
      main: '#f7f9fc', // light neutral background
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
