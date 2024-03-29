import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from './themes/contract.css';
import { fontSizes } from './global.css';

globalStyle('html', {
  fontSize: '100%',
});

globalStyle('body', {
  margin: 0,
  padding: 0,
  fontSize: fontSizes.default,
});

export const root = style({
  color: vars.color.default,
  fontFamily: vars.font.default,
  backgroundColor: vars.backgroundColor.default,
  display: 'flex',
  width: '100vw',
  height: '100vh',
});
