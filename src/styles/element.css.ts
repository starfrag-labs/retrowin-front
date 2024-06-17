import { StyleRule, style } from '@vanilla-extract/css';

export const elementsContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
  gap: '1rem',
});

export const elementContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '1rem',
  borderRadius: '15px',
});

const defaultIcon: StyleRule = {
  fontSize: '3rem',
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

export const elementNameText = style({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  color: 'white',
  filter: 'drop-shadow(0 0 1px black) drop-shadow(0 0 1px black)',
});

export const elementNameTextarea = style({
  textAlign: 'center',
  resize: 'none',
  scrollbarWidth: 'none',
  height: 'auto',
});

export const elementNameContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  boxSizing: 'border-box',
  marginTop: '0.5rem',
  fontSize: '1rem',
});

export const draggingElementsIcon = style({
  ...defaultIcon,
  position: 'absolute',
  opacity: 0.5,
  pointerEvents: 'none',
  zIndex: 9999,
});
