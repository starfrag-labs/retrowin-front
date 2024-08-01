import { style } from '@vanilla-extract/css';

export const imageViewerContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgb(0, 0, 0)',
});

export const viewControllerContainer = style({
  display: 'flex',
  flexDirection: 'row',
});

export const activeControllerButton = style({
  width: '50px',
  height: '50px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  color: 'rgba(255, 255, 255, 0.5)',
  zIndex: 1,
});

export const inactiveControllerButton = style({
  width: '50px',
  height: '50px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  color: 'rgba(255, 255, 255, 0.1)',
  zIndex: 1,
});

export const mediaContainer = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

export const mediaContent = style({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

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
