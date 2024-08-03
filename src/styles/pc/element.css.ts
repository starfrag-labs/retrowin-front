import { StyleRule, style } from '@vanilla-extract/css';

export const elementsContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
  gap: '1rem',
});

const element = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '1rem',
  borderRadius: '15px',
  whiteSpace: 'nowrap',
});

export const backgroundElement = style([element, {
  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}]);

export const backgroundSelectedElement = style([element, {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
}]);

export const windowElement = style([element, {
  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
}]);

export const windowSelectedElement = style([element, {
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
}]);

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

const defaultText: StyleRule = {
  width: '100%',
  height: 'auto',
  textOverflow: 'ellipsis',
  wordWrap: 'break-word',
  overflow: 'hidden',
  whiteSpace: 'wrap',
  textAlign: 'center',
} as const;

export const backgroundElementNameText = style({
  ...defaultText,
  color: 'white',
  filter: 'drop-shadow(0 0 0.5px black) drop-shadow(0 0 0.5px black)',
});

export const windowElementNameText = style({
  ...defaultText,
  color: 'black',
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
  position: 'fixed',
  opacity: 0.5,
  pointerEvents: 'none',
  zIndex: 9999,
});

export const draggingElementsCount = style({
  position: 'relative',
  border: '1px solid black',
  borderRadius: '50%',
  backgroundColor: 'lightblue',
  bottom: '1.5rem',
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
