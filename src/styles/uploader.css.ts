import { style } from "@vanilla-extract/css";

export const uploaderContainer = style({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  borderRadius: '15px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  
});