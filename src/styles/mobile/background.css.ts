import { style } from '@vanilla-extract/css';

export const backgroundContainer = style({
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  width: '100%',
  height: '100dvh',
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
