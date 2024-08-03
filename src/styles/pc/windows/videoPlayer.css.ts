import { style } from "@vanilla-extract/css";

export const videoPlayerContainer = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgb(0, 0, 0)',
  overflow: 'hidden',
})

export const videoSrc = style({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
})