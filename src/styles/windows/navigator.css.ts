import { style } from "@vanilla-extract/css";

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

export const treeContainer = style({
  display: 'flex',
  borderRight: '1px solid rgba(0, 0, 0, 0.8)',
  paddingTop: '0.5rem',
  width: '8rem',
  overflow: 'auto',
});

export const tree = style({
  display: 'block',
  width: '100%',
});

export const treeFolder = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '0.1rem',
  ':hover': {
    backgroundColor: '#f0f0f0',
  },
})

export const emptySpace = style({
  display: 'block',
  paddingLeft: '1rem',
});

export const treeFolderName = style({
  display: 'block',
  fontSize: '0.85rem',
  cursor: 'pointer',
});