import { style } from '@vanilla-extract/css';

export const defaultContainer = style({
  width: '100%',
  height: '100%',
  color: 'black',
});

export const flexCenter = style([defaultContainer, {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}]);

export const fixedFull = style([defaultContainer, {
  position: 'fixed',
}]);