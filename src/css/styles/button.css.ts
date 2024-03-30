import { style } from '@vanilla-extract/css';
import { themeVars } from '../themes/contract.css';
import { colors, fontSizes, transitionDurations } from '../global.css';

export const button = style({
  height: '2.5rem',
  width: '5rem',
  border: 'solid 1px',
  borderRadius: '15px',
  cursor: 'pointer',
  backgroundColor: themeVars.primary[500],
  color: colors.white,
  alignContent: 'center',
  justifyContent: 'center',
  fontSize: fontSizes.default,
  fontWeight: 'bold',
  transitionDuration: transitionDurations.default,

  ':hover': {
    backgroundColor: themeVars.primary[300],
  },
});
