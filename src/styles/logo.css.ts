import { globalStyle, style } from "@vanilla-extract/css";

export const logo = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  // gradient text
  background: 'linear-gradient(90deg, #008cbb, #00aad2)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  // border to text
  WebkitTextStroke: '0.25px black',
});

export const logoImage = style({
  aspectRatio: '1/1',
  marginRight: '0.5rem',
  fill: 'red',
});

globalStyle('#gradient', {
  vars: {
    '--grad-start': '#008cbb',
    '--grad-end': '#00aad2',
  }
})

globalStyle(':root', {
  vars: {
    '--grad-start': '#008cbb',
    '--grad-end': '#00aad2',
  }
})
