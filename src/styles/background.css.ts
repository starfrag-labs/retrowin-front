import { style } from '@vanilla-extract/css';

export const backgroundSelectorContainer = style({
  height: '100%',
  width: '100%',
  position: 'absolute',
});

export const backgroundContainer = style({
  height: '100%',
  width: '100%',
});

export const sky = style({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
});

export const clouds = style({
  position: 'absolute',
  background: 'url(/src/assets/clouds.png)',
  backgroundSize: 'cover',
  width: '100%',
  height: '100%',
  backgroundRepeat: 'no-repeat',
  top: '0',
});

export const stars = style({
  position: 'absolute',
  width: '100%',
  height: '100%',
});

export const ground = style({
  background: 'url(/src/assets/ground.png)',
  backgroundSize: 'cover',
  position: 'absolute',
  height: '100%',
  width: '100%',
  backgroundRepeat: 'no-repeat',
  bottom: '0',
});

export const meteorContainer = style({
  position: 'absolute',
  display: 'none',
  width: '100vw',
  height: '100vh',
});

export const meteor = style({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: 'white',
  borderRadius: '50%',
  boxShadow: '0 0 10px 1px #fff2cc',
});

export const meteorTail = style({
  position: 'absolute',
  top: '25%',
  left: '25%',
  width: '2000%',
  height: '50%',
  background: 'linear-gradient(-90deg, #fff0, #eee)',
  content: '""',
});