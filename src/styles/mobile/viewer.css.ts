import { style } from '@vanilla-extract/css';
import { flexCenter } from '../common/container.css';

export const viewerContainer = style([
  flexCenter,
  {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'black',
    position: 'fixed',
    top: 0,
    left: 0,
  },
]);

export const viewControllerContainer = style({
  display: 'flex',
  flexDirection: 'row',
});

export const activeControllerButton = style([
  flexCenter,
  {
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.5)',
    zIndex: 1,
  },
]);

export const inactiveControllerButton = style([
  flexCenter,
  {
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
]);

export const mediaContainer = flexCenter;

export const mediaContent = style([
  flexCenter,
  {
    objectFit: 'contain',
  },
]);

export const viewerNav = style({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  height: 'auto',
  alignItems: 'center',
  position: 'fixed',
  top: 0,
  padding: '10px',
  boxSizing: 'border-box',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  zIndex: 1,
});

export const viewerBottom = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'fixed',
  bottom: 0,
  width: '100%',
  height: 'auto',
  padding: '10px',
  boxSizing: 'border-box',
  zIndex: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
});

export const pageNumber = style({
  color: 'rgba(255, 255, 255, 0.5)',
  fontSize: '1.5rem',
  margin: '0 10px',
});
