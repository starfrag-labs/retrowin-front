import { style } from '@vanilla-extract/css';
import { fontSizes, paddings } from '../global.css';
import { themeVars } from '../themes/contract.css';

export const logo = style({
  textTransform: 'uppercase',
  alignItems: 'center',
  display: 'flex',
  fontSize: fontSizes.big,
  padding: paddings.default,
  fontWeight: 'bold',
});

export const logoFront = style({
  color: themeVars.logo.front,
});

export const logoBack = style({
  background: `linear-gradient(45deg, ${themeVars.logo.start}, ${themeVars.logo.end})`,
  color: 'transparent',
  WebkitBackgroundClip: 'text',
});
