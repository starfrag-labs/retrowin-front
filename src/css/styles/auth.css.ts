import { style } from '@vanilla-extract/css';

export const authContainer = style({
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid black',
  borderRadius: '20px',
  backgroundColor: 'white',
  width: '50rem',
  height: '20rem',
  marginBottom: '4rem',
});

export const authForm = style({
  marginTop: '3rem',
  display: 'grid',
  gap: '10px',
});
