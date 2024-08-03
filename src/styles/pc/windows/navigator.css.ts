import { style } from '@vanilla-extract/css';

export const navigatorContainer = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  width: '100%',
  height: '100%',
  overflow: 'auto',
});

export const itemContainer = style({
  display: 'block',
  width: '100%',
  height: '100%',
});

