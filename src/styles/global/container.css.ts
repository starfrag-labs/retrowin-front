import { keyframes, style } from '@vanilla-extract/css';

export const defaultContainer = style({
  width: '100%',
  height: '100%',
  color: 'black',
});

const popupPageAnimation = keyframes({
  'from': {
    opacity: 0,
  },
  'to': {
    opacity: 1,
  },
});

export const pcPageContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',

  animationName: popupPageAnimation,
  animationDuration: '1s',
});

export const centerContainer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  flexDirection: 'column',
});

export const navContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingTop: '20px',
  paddingBottom: '20px',
});

export const rowButtonContainer = style({
  display: 'flex',
  flexDirection: 'row',
});
