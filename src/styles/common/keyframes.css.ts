import { keyframes } from '@vanilla-extract/css';

export const opacityAnimation = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const slideUpAnimation = keyframes({
  from: {
    transform: 'translateY(100%)',
  },
  to: {
    transform: 'translateY(0)',
  },
});
