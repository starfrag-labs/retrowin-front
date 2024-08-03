import { style, StyleRule } from "@vanilla-extract/css";
import { flexCenter } from "../common/container.css";

export const modalContainer = style([flexCenter, {
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
}])

export const modal = style({
  width: '80%',
  backgroundColor: 'white',
  borderRadius: '8px',
})

export const modalContent = style({
  display: 'flex',
  padding: '1rem',
  color: 'rgba(0, 0, 0, 0.8)',
})

export const modalInput = style({
  display: 'flex',
  width: '100%',
  padding: '0.5rem',
  fontSize: '1rem',
  border: '1px solid rgba(0, 0, 0, 0.4)',
  borderRadius: '4px',
})

export const modalButtonContainer = style({
  display: 'flex',
  justifyContent: 'space-around',
  // line on top
  borderTop: '1px solid rgba(0, 0, 0, 0.4)',
})

const modalButtonBase: StyleRule = {
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  fontSize: '1.25rem',
  padding: '0.5rem',
  ':active': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
} as const

export const modalAccept = style({
  ...modalButtonBase,
  color: 'rgb(0, 122, 255)',
})

export const modalCancel = style({
  ...modalButtonBase,
  color: 'rgb(255, 59, 48)',
  // line on right
  borderRight: '1px solid rgba(0, 0, 0, 0.4)',
})