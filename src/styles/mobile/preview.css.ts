import { style } from '@vanilla-extract/css';
import { flexCenter } from '../common/container.css';
import { theme } from '../themes/theme.css';

export const previewContainer = style([
  flexCenter,
  {
    borderRadius: '10px',
    border: theme.border.light,
    overflow: 'hidden',
  },
]);

export const previewImageContainer = style([
  flexCenter,
  {
    backgroundColor: 'black',
  },
]);

export const previewImage = style({
  display: 'block',
  width: '100%',
  maxHeight: '100%',
  objectFit: 'cover',
});
