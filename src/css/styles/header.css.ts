import { style } from '@vanilla-extract/css';
import { paddings } from '../global.css';

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
  height: '5rem',
  borderBottom: '1px solid black',
  paddingLeft: paddings.default,
  paddingRight: paddings.default,
});
