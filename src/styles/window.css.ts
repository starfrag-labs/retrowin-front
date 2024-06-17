import { style } from "@vanilla-extract/css";

export const windowContainer = style({
  position: 'absolute',
  backgroundColor: 'rgb(250, 250, 250)',
  border: '1px solid black',
});

export const windowContent = style({
  width: '100%',  
});

export const windowHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem',
  backgroundColor: 'rgb(200, 200, 200)',
  borderBottom: '1px solid black',
});

export const navigatorContainer = style({
  width: '100%',
  height: '100%',
});