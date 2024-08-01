import { keyframes, style } from '@vanilla-extract/css';

export const backgroundSelectorContainer = style({
  height: '100%',
  width: '100%',
  position: 'fixed',
});

const popupBackground = keyframes({
  'from': {
    opacity: 0,
  },
  'to': {
    opacity: 1,
  },
});

export const backgroundContainer = style({
  position: 'fixed',
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  animation: `${popupBackground} 1s`,
});

export const sky = style({
  position: 'fixed',
  width: '100%',
  height: '100%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
});

export const clouds = style({
  position: 'fixed',
  background: 'url(/src/assets/clouds.png)',
  backgroundSize: 'cover',
  width: '100%',
  height: '100%',
  backgroundRepeat: 'no-repeat',
  top: '0',
});

export const starContainer = style({
  position: 'fixed',
  width: '100%',
  height: '100%',
});

export const moon = style({
  position: 'fixed',
  background: 'url(/src/assets/moon.png)',
  backgroundSize: 'cover',
  width: '70px',
  height: '70px',
  left: 0,
  bottom: 0,
  transitionDuration: '5s',
  transitionTimingFunction: 'linear',
});

export const ground = style({
  background: 'url(/src/assets/ground.png)',
  backgroundSize: 'cover',
  position: 'fixed',
  height: '100%',
  width: '100%',
  backgroundRepeat: 'no-repeat',
  bottom: '0',
});

export const meteorContainer = style({
  position: 'fixed',
  display: 'none',
  width: '100vw',
  height: '100vh',
});

export const meteor = style({
  position: 'fixed',
  width: '100%',
  height: '100%',
  backgroundColor: 'white',
  borderRadius: '50%',
  boxShadow: '0 0 10px 1px #fff2cc',
});

export const meteorTail = style({
  position: 'fixed',
  top: '25%',
  left: '25%',
  width: '2000%',
  height: '50%',
  background: 'linear-gradient(-90deg, #fff0, #eee)',
  content: '""',
});
