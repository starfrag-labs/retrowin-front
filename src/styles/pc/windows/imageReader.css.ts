import { StyleRule, style } from "@vanilla-extract/css";

export const imageReaderContainer = style({
  display: 'flex',
  width: '100%',  
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgb(0, 0, 0)',  
  overflow: 'hidden',
})

export const imageSrc = style({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
})

const defaultButton: StyleRule = {
  width: '50px',
  height: '50px',
  color: 'rgb(255, 255, 255)',
  padding: '10px',
  cursor: 'pointer',
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  filter: 'drop-shadow(0px 0px 1px rgb(0, 0, 0))',
  ':hover': {
    color: 'lightgrey',
  },
} as const;

export const nextButton = style({
  ...defaultButton,
  right: '0',
})

export const prevButton = style({
  ...defaultButton,
  left: '0',
})
