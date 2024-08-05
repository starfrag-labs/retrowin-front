import { style } from '@vanilla-extract/css';
import { flexCenter, defaultContainer } from './container.css';
import { opacityAnimation } from './keyframes.css';

export const pcPageContainer = style([
  flexCenter,
  {
    flexDirection: 'column',
    overflow: 'hidden',
    animationName: opacityAnimation,
    animationDuration: '1s',
  },
]);

export const mobilePageContainer = style([
  defaultContainer,
  {
    display: 'flex',
    flexDirection: 'column',
  },
]);

export const mobilePageContent = style([
  defaultContainer,
  {
    display: 'flex',
    flexDirection: 'column',
    padding: '4rem 1rem',
    boxSizing: 'border-box',
  },
]);
