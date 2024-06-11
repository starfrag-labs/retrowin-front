import { globalStyle, style } from '@vanilla-extract/css';
import { themeVars } from '../themes/contract.css';
import { fontSizes } from '../global.css';

globalStyle('html', {
  fontSize: '100%',
});

globalStyle('body', {
  margin: 0,
  padding: 0,
  fontSize: fontSizes.default,
  overflow: 'hidden',
});

export const root = style({
  color: themeVars.color.default,
  fontFamily: themeVars.font.default,
  backgroundColor: themeVars.backgroundColor.default,
  backgroundSize: 'cover',
  display: 'flex-wrap',
  width: '100vw',
  height: '100vh',
});
