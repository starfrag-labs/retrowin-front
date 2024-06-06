import { StyleRule, style } from '@vanilla-extract/css';

export const elementContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
});

export const IconContainer = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid black',
  borderRadius: '10px',
  width: '200px',
  height: '200px',
  margin: '10px',
  cursor: 'pointer',
  transition: '0.3s',
  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

const defaultIcon: StyleRule = {
  fontSize: '5rem',
  marginBottom: '10px',
} as const;

export const fileIcon = style({
  ...defaultIcon,
  color: 'lightblue',
});

export const folderIcon = style({
  ...defaultIcon,
  color: 'orange',
});

export const deleteIcon = style({
  fontSize: '3rem',
  color: 'lightcoral',
  cursor: 'pointer',
  position: 'absolute',
  top: '5px',
  right: '5px',
  ':hover': {
    color: 'red',
  },
  transition: '0.3s',
});

export const downloadIcon = style({
  fontSize: '2.5rem',
  color: 'grey',
  cursor: 'pointer',
  position: 'absolute',
  top: '10px',
  right: '10px',
  ':hover': {
    color: 'black',
  },
  transition: '0.3s',
});

export const elementName = style({
  textAlign: 'center',
});
