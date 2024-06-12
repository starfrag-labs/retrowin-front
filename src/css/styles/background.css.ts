import { StyleRule, style } from '@vanilla-extract/css';

export const indexBackground = style({
  backgroundImage: 'url(/src/assets/vault.jpg)',
  backgroundSize: 'cover',
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
});

export const backgroundSelectorContainer = style({
  height: '100vh',
  width: '100%',
  position: 'absolute'
});

export const childContainer = style({
});

const backgroundDefault: StyleRule = {
  position: 'absolute',
  width: '100%',
  backgroundRepeat: 'no-repeat',
  transition: 'background-image 1s ease-in-out',
} as const;

export const sky = style({
  ...backgroundDefault,
  backgroundSize: 'cover',
  height: '100%',
});

export const stars = style({
  width: '100vw',
  height: '100vh',
  position: 'absolute',
});

export const ground = style({
  ...backgroundDefault,
  backgroundSize: 'cover',
  bottom: '0',
  height: '100%'
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