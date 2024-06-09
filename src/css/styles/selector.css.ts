import { style } from "@vanilla-extract/css";

export const selector = style({
  position: 'absolute',
  top: '0',
  left: '0',
  width: '1px',
  height: '1px',
  backgroundColor: 'rgba(0, 0, 255, 0.2)',
  border: '1px solid blue',
  transformOrigin: '0 0',
});