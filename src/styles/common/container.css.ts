import { style } from '@vanilla-extract/css';
import { theme } from '../themes/theme.css';

export const defaultContainer = style({
  width: '100%',
  height: '100%',
});

export const appContainer = style([
  defaultContainer,
  {
    backgroundColor: theme.primary.normal,
    color: theme.text.normal,
  },
]);

export const flexCenter = style([
  defaultContainer,
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
]);

export const fixedFull = style([
  defaultContainer,
  {
    position: 'fixed',
  },
]);
