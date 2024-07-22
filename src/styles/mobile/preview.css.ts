import { style } from '@vanilla-extract/css';

export const previewContainer = style({
  display: 'flex',
  backgroundColor: 'white',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '10px',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  overflow: 'hidden'
});

export const imagePreview = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});
