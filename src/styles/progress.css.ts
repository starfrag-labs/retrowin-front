import { style } from '@vanilla-extract/css';

export const progressWindow = style({
  position: 'fixed',
  backgroundColor: 'rgba(250, 250, 250, 1)',
  border: '1px solid black',
  overflow: 'hidden',
  bottom: '0',
  right: '0',
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  gap: '0.5rem',
});

export const progressContainer = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '0.5rem',   
  alignItems: 'center',
  justifyContent: 'left',
  '::after': {  
    content: '""',
    display: 'table',
    clear: 'both',
  },
});

export const progressName = style({
  width: '5rem',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

export const progressBar = style({
  width: '15rem',
});