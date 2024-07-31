import { style } from '@vanilla-extract/css';

export const navContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '10px',
  paddingBottom: '10px',
  width: '100%',
  padding: '10px 20px',
  // shadow under nav
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  boxSizing: 'border-box',
});

export const navLogoContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

export const navItemsContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '1rem',
});

export const returnIcon = style({
  height: '30px',
  width: '30px',
  cursor: 'pointer',
});

export const uploadIcon = style({
  height: '30px',
  width: '30px',
  cursor: 'pointer',
  color: 'rgba(0, 0, 0, 0.8)',
  transitionDuration: '0.3s',
});
