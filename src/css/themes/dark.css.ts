import { createTheme } from '@vanilla-extract/css';
import { colors, primaryColor } from '../global.css';
import { themeVars } from './contract.css';

export const darkTheme = () => {
  const primary = primaryColor(0, 0);
  return createTheme(themeVars, {
    color: {
      default: colors.grey[50],
    },
    font: {
      default: 'Roboto, sans-serif',
    },
    backgroundColor: {
      default: primary[900],
    },
    logo: {
      front: colors.grey[50],
      start: primary[500],
      end: primary.r500,
    },
    primary: primary,
  });
};
