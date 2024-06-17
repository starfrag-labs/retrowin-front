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
  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

const defaultElement: StyleRule = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '1rem',
  borderRadius: '15px',
  whiteSpace: 'nowrap',
} as const;

export const backgroundElement = style({
  ...defaultElement,
  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export const backgroundSelectedElement = style({
  ...defaultElement,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  whiteSpace: 'wrap',
});

export const windowElement = style({
  ...defaultElement,
  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export const windowSelectedElement = style({
  ...defaultElement,
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  whiteSpace: 'wrap',
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
  filter: 'drop-shadow(0 0 0.5px black) drop-shadow(0 0 0.5px black)',
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
