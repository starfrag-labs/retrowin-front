import { style } from '@vanilla-extract/css';
import { theme } from '../themes/theme.css';

export const navContainer = style({
  display: 'flex',
  position: 'fixed',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '10px',
  paddingBottom: '10px',
  width: '100%',
  padding: '10px 20px',
  // shadow under nav
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
  boxSizing: 'border-box',
  backgroundColor: theme.primary.normal,
  zIndex: 1,
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
  gap: '0.5rem',
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
  color: theme.text.normal,
  transitionDuration: '0.3s',
});
