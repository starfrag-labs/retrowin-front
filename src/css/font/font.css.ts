import { globalFontFace } from '@vanilla-extract/css';

export const robotoRegular = 'robotoRegular';
export const robotoThin = 'robotoThin';

globalFontFace(robotoRegular, {
  src: 'local("./Roboto-Regular.ttf")',
  fontWeight: 'normal',
});

globalFontFace(robotoThin, {
  src: 'local("./Roboto-Thin.ttf")',
  fontWeight: 'thin',
});
