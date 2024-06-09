import { style } from "@vanilla-extract/css";

export const indexBackground = style({
  backgroundImage: 'url(/src/assets/vault.jpg)',
  backgroundSize: 'cover',
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
})

export const cloudBackground = style({
  backgroundImage: `url('/src/assets/background.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100%',
  width: '100%',
})
