import { keyframes, style } from '@vanilla-extract/css';

export const setupPageContainer = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  backgroundColor: 'white',
  alignItems: 'center',
  justifyContent: 'center',
});

export const logoContainer = style({
  width: '20rem',

  '@media': {
    'screen and (max-width: 600px)': {
      blockSize: '10rem',
    },
  },
});

export const circularLoadingContainer = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

const spin = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

export const circularLoadingSpinner = style({
  width: '100px',
  height: '100px',
  border: '8px solid rgba(255, 255, 255, 0.3)',
  borderTop: '8px solid white',
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`,
});

const gradient = keyframes({
  '0%': {
    backgroundPosition: '0% 50%',
  },
  '50%': {
    backgroundPosition: '100% 50%',
  },
  '100%': {
    backgroundPosition: '0% 50%',
  },
});

export const boxLoading = style({
  display: 'flex',
  background:
    'linear-gradient(270deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.01))',
  backgroundSize: '600% 600%',
  animation: `${gradient} 2s linear infinite`,
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

export const boxLoadingDots = style({
  fontSize: '2rem',
  color: 'rgba(0,0,0,0.1)',
});
