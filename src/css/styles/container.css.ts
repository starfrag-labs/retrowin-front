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
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  border: '2px solid black',
  borderRadius: '25px',
  padding: '20px',
  width: '50%',
  height: '50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
})

export const gridContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '20px',
  padding: '20px',
})

export const navContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '20px',
})

export const columnButtonContainer = style({
  display: 'flex',
  flexDirection: 'column',
})

export const rowButtonContainer = style({
  display: 'flex',
  flexDirection: 'row',
})
