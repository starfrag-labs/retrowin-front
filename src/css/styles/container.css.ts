import { style } from "@vanilla-extract/css";
import { paddings } from "../global.css";

export const pageContainer = style({
  paddingLeft: paddings.default,
  paddingRight: paddings.default,
})

export const centerContainer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  flexDirection: 'column',
})


export const blurContainer = style({
  backdropFilter: 'blur(3px)',
  border: '1px solid black',
  borderRadius: '25px',
  padding: '20px',
  width: '50%',
  height: '50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})