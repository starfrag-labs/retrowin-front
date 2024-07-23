import { style } from '@vanilla-extract/css';

export const imageViewerContainer = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

export const viewControllerContainer = style({
  display: 'flex',
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

export const imageContent = style({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

export const viewerNav = style({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  zIndex: 1,
  padding: '10px',
  boxSizing: 'border-box',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
});

export const returnButtonIcon = style({
  width: '50px',
  height: '50px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  color: 'rgba(255, 255, 255, 0.5)',
});

export const viewerBottom = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'absolute',
  bottom: 0,
  width: '100%',
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
