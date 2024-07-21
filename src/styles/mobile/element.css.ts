import { style, StyleRule } from '@vanilla-extract/css';

export const elementsContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gridGap: '5px',
  width: '100%',
  padding: '10px',
  boxSizing: 'border-box',
});

export const elementContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '10px',
  width: '100%',
  maxWidth: '50vw',
  aspectRatio: '1 / 0.6',
  padding: '10px',
  boxSizing: 'border-box',
});

export const elementNameContainer = style({
  display: 'block',
  justifyContent: 'center',
  alignItems: 'center',
  width: '8rem',
  margin: '10px',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  // ios safari
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  WebkitBackfaceVisibility: 'hidden',
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