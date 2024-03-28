import { globalFontFace } from '@vanilla-extract/css';

export const robotoRegular = 'robotoRegular';
export const robotoThin = 'robotoThin';

globalFontFace(robotoRegular, {
  src: `local('/css/font/Roboto-Regular.ttf')`,
  fontWeight: 'normal',
});

globalFontFace(robotoThin, {
  src: 'local("/css/font/Roboto-Thin.ttf")',
  fontWeight: 'thin',
});
