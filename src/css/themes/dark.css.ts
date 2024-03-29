import { createTheme } from '@vanilla-extract/css';
import { colors, primaryColor } from '../global.css';
import { vars } from './contract.css';

export const darkTheme = createTheme(vars, {
  color: {
    default: colors.grey[50],
  },
  font: {
    default: 'Roboto, sans-serif',
  },
  backgroundColor: {
    default: primaryColor(0, 0)[900],
  },
});
