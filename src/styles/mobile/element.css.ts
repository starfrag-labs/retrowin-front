import { style, StyleRule } from '@vanilla-extract/css';

export const elementsContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(8.75rem, 1fr))',
  gridAutoRows: '10rem',
  width: '100%',
  height: 'auto',
  padding: '1rem',
  boxSizing: 'border-box',
  gap: '5px',
});

const elementContainerBase = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '10px',
  width: '100%',
  height: 'auto',
  maxWidth: '50vw',
  boxSizing: 'border-box',
  padding: '10px',
  ':active': {
    backgroundColor: '#f0f0f0',
  },
} as const;

export const elementContainer = style({
  ...elementContainerBase,
});

export const selectedElement = style({
  backgroundColor: '#f0f0f0',
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

const defaultIcon: StyleRule = {
  width: '50%',
  height: '50%',
  filter: 'drop-shadow(0 0 1px black)',
} as const;

export const uploadFileIcon = style({
  ...defaultIcon,
  color: 'lightblue',
});

export const fileIcon = style({
  ...defaultIcon,
  color: 'lightgrey',
});

export const folderIcon = style({
  ...defaultIcon,
  color: 'orange',
});

export const miniFolderIcon = style({
  fontSize: '1.5rem',
  color: 'orange',
});

export const emptyFolderMessage = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  fontSize: '1.5rem',
  color: 'grey',
});