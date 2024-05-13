import { style } from "@vanilla-extract/css";

export const indexBackground = style({
  backgroundImage: 'url(./src/assets/vault.jpg)',
  backgroundSize: 'cover',
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
})
