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

export const ground = style({
  ...backgroundDefault,
  backgroundSize: 'cover',
  bottom: '0',
  height: '100%'
});
