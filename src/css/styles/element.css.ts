import { StyleRule, style } from '@vanilla-extract/css';

export const elementContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
});

export const BoxContainer = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid black',
  borderRadius: '10px',
  width: '80%',
  cursor: 'pointer',
  transition: '0.3s',
  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  ':before': {
    content: '""',
    display: 'block',
    paddingTop: '100%',
  },
});

export const IconContainer = style({
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const defaultIcon: StyleRule = {
  fontSize: '5rem',
} as const;

export const fileIcon = style({
  ...defaultIcon,
  color: 'lightblue',
});

export const folderIcon = style({
  ...defaultIcon,
  color: 'orange',
});

export const menu = style({
  position: 'absolute',
  top: '0px',
  right: '0px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  border: '1px solid black',
  zIndex: 1,
});

export const menuIcon = style({
  fontSize: '2rem',
  color: 'grey',
  cursor: 'pointer',
  transition: '0.3s',
  position: 'absolute',
  padding: '5px',
  top: '0px',
  right: '0px',
  ':hover': {
    color: 'black',
  },
});

export const buttonIcon = style({
  fontSize: '3rem',
  cursor: 'pointer',
  transition: '0.3s',
  ':hover': {
    color: 'black',
  },
});

export const deleteIcon = style({
  fontSize: '3rem',
  color: 'lightcoral',
  cursor: 'pointer',
  position: 'absolute',
  top: '0px',
  right: '0px',
  ':hover': {
    color: 'red',
  },
  transition: '0.3s',
});

export const elementName = style({
  textAlign: 'center',
});
