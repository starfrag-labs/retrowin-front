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

export const imagePreview = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});
