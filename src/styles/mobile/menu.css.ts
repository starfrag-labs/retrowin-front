import { style } from '@vanilla-extract/css';
import { opacityAnimation, slideUpAnimation } from '../common/keyframes.css';
import { flexCenter } from '../common/container.css';
import { theme } from '../themes/theme.css';

export const menuContainer = style([
  flexCenter,
  {
    position: 'fixed',
    top: '0',
    flexDirection: 'column',
    // place items at the bottom of the screen
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    animation: `${opacityAnimation} 0.1s ease-in-out`,
  },
]);

export const menu = style([
  flexCenter,
  {
    flexDirection: 'column',
    height: 'auto',
    backgroundColor: theme.primary.light,
    borderRadius: '10px 10px 0 0',
    animation: `${slideUpAnimation} 0.5s ease-in-out`,
  },
]);

export const uploadForm = style([
  flexCenter,
  {
    flexDirection: 'row',
  },
]);

export const menuLabel = style([
  flexCenter,
  {
    // borderBottom: '1px solid black',
    padding: '10px',
    boxSizing: 'border-box',
    gap: '1rem',

    selectors: {
      '&:not(:last-child)': {
        borderBottom: theme.border.normal,
      },
    },
  },
]);

export const leftJustifiedMenuLabel = style([
  menuLabel,
  {
    justifyContent: 'flex-start',
  },
]);

export const editMenu = style({
  display: 'flex',
  position: 'fixed',
  bottom: '0',
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-around',
  padding: '15px',
  boxSizing: 'border-box',
  backgroundColor: theme.primary.light,
});

export const editMenuItemIcon = style({
  display: 'flex',
  width: '30px',
  height: '30px',
  color: theme.text.normal,
});
