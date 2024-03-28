import { style } from '@vanilla-extract/css';
import { vars } from './theme/contract.css';

export const root = style({
  fontFamily: vars.font.default,
  padding: vars.padding.default,
  backgroundColor: vars.backgroundColor.default,
  display: vars.display.default,
  width:'100vw',
  height:'100vh',
});
