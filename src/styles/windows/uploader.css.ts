import { style } from '@vanilla-extract/css';

export const uploaderContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
});

export const uploader = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '80%',
  height: '100%',
});

export const uploadTitle = style({
  textTransform: 'uppercase',
  fontSize: '2rem',
  marginBottom: '20px',
});

export const uploadForm = style({
  display: 'flex',
  flexFlow: 'row wrap',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '10px',
  border: '1px solid black',
  borderRadius: '5px',
});

export const uploadInput = style({
  display: 'flex',
  flexFlow: 'row wrap',
  alignItems: 'center',
  justifyContent: 'center',
});

export const uploadLabel = style({
  display: 'inline-block',
  alignItems: 'center',
  padding: '3px 20px',
  marginRight: '10px',
  border: '1px solid black',
  borderRadius: '5px',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  textTransform: 'capitalize',
  fontSize: '1rem',
  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
});

export const uploadName = style({
  display: 'inline-block',
  backgroundColor: 'rgba(0, 0, 0, 0.0)',
  border: 'none',
  fontSize: '1rem',
});

export const uploadButton = style({
  display: 'inline-block',
  padding: '3px 20px',
  border: '1px solid black',
  borderRadius: '5px',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  textTransform: 'capitalize',
  fontSize: '1rem',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
});