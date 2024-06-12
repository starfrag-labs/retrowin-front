import { createThemeContract } from '@vanilla-extract/css';

export const themeVars = createThemeContract({
  color: {
    default: null,
  },
  font: {
    default: null,
  },
  backgroundColor: {
    default: null,
  },
  logo: {
    front: null,
    start: null,
    end: null,
  },
  primary: {
    100: null,
    200: null,
    300: null,
    400: null,
    500: null,
    600: null,
    700: null,
    800: null,
    900: null,
    r100: null,
    r200: null,
    r300: null,
    r400: null,
    r500: null,
    r600: null,
    r700: null,
    r800: null,
    r900: null,
  },
});
