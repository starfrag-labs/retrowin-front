import { style } from "@vanilla-extract/css";

export const logo = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  // gradient text
  background: 'linear-gradient(90deg, #ff00ff, #ff0000)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});