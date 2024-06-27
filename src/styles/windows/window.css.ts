import { StyleRule, style } from "@vanilla-extract/css";

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

export const btnContainer = style({
  display: 'flex',
  gap: '0.5rem',
});

const btn: StyleRule = {
  width: '1rem',
  height: '1rem',
  fontSize: '1rem',
  padding: '0.5rem',
  cursor: 'pointer',
  borderRadius: '50%',
  border: 'none',
} as const;

export const maximizeBtn = style({
  ...btn,
  backgroundColor: 'rgb(100, 255, 100)',
});

export const minimizeBtn = style({  
  ...btn,
  backgroundColor: 'rgb(100, 100, 255)',
});

export const closeBtn = style({
  ...btn,
  backgroundColor: 'rgb(255,100, 100)',
});