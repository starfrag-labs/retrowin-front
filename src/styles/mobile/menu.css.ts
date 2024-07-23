import { keyframes, style } from '@vanilla-extract/css';

export const slideUp = keyframes({
  from: {
    transform: 'translateY(100%)',
  },
  to: {
    transform: 'translateY(0)',
  },
});

export const menuContainer = style({
  display: 'flex',
  position: 'fixed',
  top: '0',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  // place items at the bottom of the screen
  justifyContent: 'flex-end',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  transition: 'ease-in-out 0.5s',
});

export const menu = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  backgroundColor: 'whitesmoke',
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '15px 10px 0 0',
  animation: `${slideUp} 0.5s ease-in-out`,
});

export const uploadForm = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  alignContent: 'center',
  justifyContent: 'center',
});

const menuLabelBase = {
  textTransform: 'capitalize',
  fontSize: '1rem',
  width: '100%',
  display: 'flex',
  borderBottom: '1px solid black',
  padding: '10px',
  boxSizing: 'border-box',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1rem',
} as const;

export const menuLabel = style({
  ...menuLabelBase,
  justifyContent: 'center',
});

export const leftJustifiedMenuLabel = style({
  ...menuLabelBase,
  justifyContent: 'flex-start',
});

export const editMenu = style({
  display: 'flex',
  position: 'fixed',
  bottom: '0',
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-around',
  padding: '15px',
  boxSizing: 'border-box',
  backgroundColor: 'whitesmoke',
});

export const editMenuItemIcon = style({
  display: 'flex',
  width: '30px',
  height: '30px',
  color: 'rgba(0, 0, 0, 0.7)',
});
