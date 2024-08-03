import { style } from '@vanilla-extract/css';
import { flexCenter } from '../common/container.css';

export const elementsContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(8.75rem, 1fr))',
  gridAutoRows: '10rem',
  width: '100%',
  height: 'auto',
  gap: '5px',
});

export const elementContainer = style([flexCenter, {
  flexDirection: 'column',
  height: 'auto',
  borderRadius: '10px',
  maxWidth: '50vw',
  boxSizing: 'border-box',
  padding: '10px',
  ':active': {
    backgroundColor: '#f0f0f0',
  },
}]);

export const selectedElement = style({
  backgroundColor: '#f0f0f0',
});

export const elementNameContainer = style({
  display: 'block',
  padding: '1rem',
  width: '70%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textAlign: 'center',
});

export const defaultIcon = style({
  width: '50%',
  height: '50%',
  filter: 'drop-shadow(0 0 1px black)',
});

export const uploadFileIcon = style([defaultIcon, {
  color: 'lightblue',
}]);

export const fileIcon = style([defaultIcon, {
  color: 'lightgrey',
}]);

export const folderIcon = style([defaultIcon, {
  color: 'orange',
}]);

export const miniFolderIcon = style({
  display: 'block',
  fontSize: '1.5rem',
  color: 'orange',
});

export const folderPageMessage = style([flexCenter,{
  fontSize: '1.5rem',
  color: 'grey',
  padding: '1rem',
  boxSizing: 'border-box',
}]);
