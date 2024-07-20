import { style } from '@vanilla-extract/css';

export const backgroundContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
});

export const background = style({
  display: 'flex',
  position: 'fixed',
  width: '200%',
  height: '200%',
  backgroundColor: 'white',
  overflow: 'hidden',
  zIndex: -1000,
});
