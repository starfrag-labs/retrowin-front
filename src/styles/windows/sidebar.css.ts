import { style } from "@vanilla-extract/css";

export const sidebarContainer = style({
  display: 'flex',
  borderRight: '1px solid rgba(0, 0, 0, 0.5)',
  width: '8rem',
  overflow: 'auto',
});

export const favoriteSidebar = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const favoriteTitle = style({
  fontSize: '0.8rem',
  borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
  padding: '0.25rem 0.5rem',
  paddingTop: '0.5rem',
  marginBottom: '0.25rem',
  textTransform: 'capitalize',
  fontWeight: 'bold',
  color: 'rgba(0, 0, 0, 0.8)',
});

export const favoriteItem = style({
  display: 'flex',
  fontSize: '0.85rem',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '0.1rem 0.75rem',
  gap: '0.1rem',
  color: 'rgba(0, 0, 0, 0.8)',
  ':hover': {
    backgroundColor: '#f0f0f0',
  },
});

export const emptySpace = style({
  display: 'block',
  paddingLeft: '1rem',
});

export const treeFolderName = style({
  display: 'block',
  fontSize: '0.85rem',
  cursor: 'pointer',
});
