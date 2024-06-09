import { style } from "@vanilla-extract/css";

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

export const navContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingTop: '20px',
  paddingBottom: '20px',
})

export const rowButtonContainer = style({
  display: 'flex',
  flexDirection: 'row',
})
