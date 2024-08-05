import { keyframes, style } from '@vanilla-extract/css';
import { defaultContainer, fixedFull } from '../common/container.css';

export const backgroundSelectorContainer = fixedFull;

export const backgroundContainer = fixedFull;

const opacityAnimation = keyframes({
  from: { opacity: 0.5 },
  to: { opacity: 1 },
});

export const nightSkyContainer = style([
  defaultContainer,
  {
    animation: `${opacityAnimation} 0.2s`,
  },
]);

export const nightSky = style([
  fixedFull,
  {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    background: 'linear-gradient(to bottom, #000, #000014)',
  },
]);

export const clouds = style([
  fixedFull,
  {
    background: 'url(/src/assets/clouds.png)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    top: '0',
    animation: `${opacityAnimation} 0.2s`,
  },
]);

export const starContainer = fixedFull;

export const moon = style({
  position: 'absolute',
  background: 'url(/src/assets/moon.png)',
  backgroundSize: 'cover',
  display: 'block',
  width: '70px',
  height: '70px',
  right: '15%',
  top: '15%',
});

export const ground = style([
  fixedFull,
  {
    background: 'url(/src/assets/ground.png)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    bottom: '0',
    transition: 'all 0.2s',
  },
]);

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

const buttonInitKeyframe = keyframes({
  '0%': {
    transform: 'scale(0.5)',
  },
  '50%': {
    transform: 'scale(1.1)',
  },
  '100%': {
    transform: 'scale(1)',
  },
});

export const themeIcon = style({
  position: 'fixed',
  bottom: '0',
  right: '0',
  width: '3rem',
  height: '3rem',
  padding: '0.75rem',
  margin: '1rem',
  borderRadius: '50%',
  boxSizing: 'border-box',
  color: 'white',
  cursor: 'pointer',
  transitionDuration: '0.3s',
  animation: `${buttonInitKeyframe} 1s`,
});

export const moonThemeIcon = style([
  themeIcon,
  {
    backgroundColor: '#666',
    color: '#FFE65D',
    ':hover': {
      backgroundColor: '#333',
      color: '#FFD700',
    },
  },
]);

export const sunThemeIcon = style([
  themeIcon,
  {
    backgroundColor: '#009cf8',
    color: '#ffc000',
    ':hover': {
      backgroundColor: '#00d0e8',
      color: '#ffcd36',
    },
  },
]);
