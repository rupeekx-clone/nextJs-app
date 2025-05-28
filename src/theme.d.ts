import { PaletteColorOptions, PaletteColor } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    ternary: PaletteColor;
    alternate: PaletteColor;
  }
  interface PaletteOptions {
    ternary?: PaletteColorOptions;
    alternate?: PaletteColorOptions;
  }
} 