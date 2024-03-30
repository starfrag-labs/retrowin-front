import { style } from '@vanilla-extract/css';

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px',
  marginBottom: '10px',
  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
  height: '5rem',
  width: '100vw',
});
