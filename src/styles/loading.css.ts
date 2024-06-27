import { keyframes, style } from "@vanilla-extract/css"

export const loadingContainer = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgb(0, 0, 0)',
})

const spin = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
})

export const loadingSpinner = style({
  width: '100px',
  height: '100px',
  border: '8px solid rgba(255, 255, 255, 0.3)',
  borderTop: '8px solid white',
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`,
})