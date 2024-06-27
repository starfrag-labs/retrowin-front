import { style } from '@vanilla-extract/css';

export const selectBox = style({
  position: 'absolute',
  display: 'none',
  top: '0',
  left: '0',
  width: '1px',
  height: '1px',
  backgroundColor: 'rgba(0, 0, 255, 0.2)',
  border: '1px solid blue',
  transformOrigin: '0 0',
  zIndex: 9999,
});

export const selector = style({
  width: '100%',
  height: '100%',
});
