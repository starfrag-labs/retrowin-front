import { createTheme } from '@vanilla-extract/css';
import { colors, primaryColor } from '../global.css';
import { themeVars } from './contract.css';

export const defaultTheme = () => {
  const primary = primaryColor(100, 50);
  return createTheme(themeVars, {
    color: {
      default: colors.grey[900],
    },
    font: {
      default: 'Roboto, sans-serif',
    },
    backgroundColor: {
      default: primary[500],
    },
    logo: {
      front: colors.grey[50],
      start: colors.white,
      end: colors.white,
    },
    primary: primary,
  });
};
