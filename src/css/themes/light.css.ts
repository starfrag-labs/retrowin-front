import { createTheme } from '@vanilla-extract/css';
import { colors, primaryColor } from '../global.css';
import { themeVars } from './contract.css';

export const lightTheme = () => {
  const primary = primaryColor(240, 50);
  return createTheme(themeVars, {
    color: {
      default: colors.grey[900],
    },
    font: {
      default: 'Roboto, sans-serif',
    },
    backgroundColor: {
      default: colors.grey[50],
    },
    logo: {
      front: colors.grey[900],
      start: primary[500],
      end: primary.r500,
    },
    primary: primary,
  });
};
