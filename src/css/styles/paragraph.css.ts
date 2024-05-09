import { style } from '@vanilla-extract/css';
import { themeVars } from '../themes/contract.css';

export const paragraph = style({
  fontSize: '1rem',
  color: themeVars.color.default,
});
