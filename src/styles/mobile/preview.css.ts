import { style } from '@vanilla-extract/css';
import { flexCenter } from '../common/container.css';

export const previewContainer = style([flexCenter, {
  borderRadius: '10px',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  overflow: 'hidden'
}]);

export const imagePreview = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});
