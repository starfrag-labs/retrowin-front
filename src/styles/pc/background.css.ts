import { style } from '@vanilla-extract/css';
import { fixedFull } from '../common/container.css';

export const backgroundSelectorContainer = fixedFull;

export const backgroundContainer = fixedFull;


export const sky = style([fixedFull, {
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
}]);

export const clouds = style([fixedFull, {
  background: 'url(/src/assets/clouds.png)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  top: '0',
}]);

export const starContainer = fixedFull;

export const moon = style({
  position: 'absolute',
  background: 'url(/src/assets/moon.png)',
  backgroundSize: 'cover',
  width: '70px',
  height: '70px',
  left: 0,
  bottom: 0,
  transitionDuration: '5s',
  transitionTimingFunction: 'linear',
});

export const ground = style([fixedFull,{
  background: 'url(/src/assets/ground.png)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  bottom: '0',
}]);

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
