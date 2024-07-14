import { style } from '@vanilla-extract/css';

export const backgroundContainer = style({
  backgroundColor: 'white',
  width: '100%',
  height: '100%',
});

export const background = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});
