import { style } from "@vanilla-extract/css";

export const windowContainer = style({
  position: 'absolute',
  backgroundColor: 'rgb(20, 20, 20)',
  border: '1px solid black',
  borderRadius: '10px',
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
  borderTopLeftRadius: '10px',
  borderTopRightRadius: '10px',
});

export const navigatorContainer = style({
  width: '100%',
  height: '100%',
});

export const closeBtn = style({
  width: '1rem',
  height: '1rem',
  fontSize: '1rem',
  padding: '0.5rem',
  cursor: 'pointer',
  borderRadius: '50%',
  backgroundColor: 'rgb(220,0, 0)',
  border: 'none',
  ':hover': {
    backgroundColor: 'rgb(250,0,0)',
  },
});