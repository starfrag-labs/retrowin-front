import { style } from "@vanilla-extract/css";

export const windowContainer = style({
  position: 'absolute',
  backgroundColor: 'rgba(250, 250, 250, 1)',
  border: '1px solid black',
  overflow: 'hidden',
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

export const closeBtn = style({
  width: '1rem',
  height: '1rem',
  fontSize: '1rem',
  padding: '0.5rem',
  cursor: 'pointer',
  borderRadius: '50%',
  backgroundColor: 'rgb(255,100, 100)',
  border: 'none',
});