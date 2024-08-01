import { style } from "@vanilla-extract/css";

export const menuContainer = style({
  position: "fixed",
  display: "none",
  backgroundColor: 'rgb(240, 240, 240)',
  border: '1px solid black',
  boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)',
});

export const menuElementContainer = style({
  display: 'flex'
});

export const menuElement = style({
  padding: '2px 5px',
  width: '100%',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export const menuSplit = style({
  width: '100%',
  borderTop: '1px solid black',
  margin: '2px 0',
});