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