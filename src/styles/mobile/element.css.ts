import { style } from '@vanilla-extract/css';
import { flexCenter } from '../common/container.css';
import { theme } from '../themes/theme.css';

export const elementsContainer = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridAutoRows: '10rem',
  width: '100%',
  height: 'auto',
  gap: '5px',

  '@media': {
    'screen and (min-width: 300px)': {
      gridTemplateColumns: '1fr 1fr',
      gridAutoRows: '10rem',
    },

    'screen and (min-width: 600px)': {
      gridTemplateColumns: '1fr 1fr 1fr',
      gridAutoRows: '12.5rem',
    },
    
    'screen and (min-width: 900px)': {
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gridAutoRows: '15rem',
    },
  },
});

export const elementContainer = style([
  flexCenter,
  {
    flexDirection: 'column',
    height: 'auto',
    borderRadius: '10px',
    maxWidth: '50vw',
    boxSizing: 'border-box',
    padding: '10px',
    ':active': {
      backgroundColor: theme.highlight.h1,
    },
  },
]);

export const selectedElement = style({
  backgroundColor: theme.highlight.h2,
});

export const elementNameContainer = style({
  display: 'block',
  padding: '1rem',
  width: '70%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textAlign: 'center',
});

export const defaultIcon = style({
  width: '50%',
  height: '50%',
  filter: 'drop-shadow(0 0 1px black)',
});

export const fileIcon = style([
  defaultIcon,
  {
    color: theme.icon.file,
  },
]);

export const folderIcon = style([
  defaultIcon,
  {
    color: theme.icon.folder,
  },
]);

export const miniFolderIcon = style({
  display: 'block',
  fontSize: '1.5rem',
  color: theme.icon.folder,
});

export const folderPageMessage = style([
  flexCenter,
  {
    fontSize: '1.5rem',
    color: theme.text.normal,
    padding: '1rem',
    boxSizing: 'border-box',
  },
]);
