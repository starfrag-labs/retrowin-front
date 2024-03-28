import { style } from '@vanilla-extract/css';
import { vars } from './theme/contract.css';
import { robotoRegular } from './font/font.css';

export const root = style({
  fontFamily: robotoRegular,
  margin: vars.margin.default,
  backgroundColor: vars.backgroundColor.default,
  display: vars.display.default,
});
