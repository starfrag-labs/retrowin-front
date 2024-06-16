import { style } from "@vanilla-extract/css";

export const windowContainer = style({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  width: '40%',
  height: '60%',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
});