import { createTheme } from '@vanilla-extract/css';
import { vars } from './contract.css';
import { robotoRegular } from '../font/font.css';
import { colors } from './global.css';

export const whiteTheme = createTheme(vars, {
  color: {
    title: colors.black,
    body: colors.black,
  },
  font: {
    default: robotoRegular,
  },
  padding: {
    default: '10px',
  },
  backgroundColor: {
    default: colors.grey[50],
  },
  display: {
    default: 'flex',
  },
});
