import { StyleRule, style } from '@vanilla-extract/css';
import { theme } from '../../themes/theme.css';

export const windowContainer = style({
  position: 'fixed',
  backgroundColor: theme.primary.normal,
  border: theme.border.normal,
});

export const windowContent = style({
  width: '100%',
});

export const windowHeader = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem',
  backgroundColor: theme.primary.dark,
  color: theme.text.normal,
});

export const windowHeaderLeft = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '0.5rem',
  alignItems: 'center',
  justifyContent: 'flex-start',
});

export const btnContainer = style({
  display: 'flex',
  gap: '0.5rem',
});

const btn: StyleRule = {
  width: '1rem',
  height: '1rem',
  fontSize: '1rem',
  padding: '0.5rem',
  cursor: 'pointer',
  borderRadius: '50%',
  border: 'none',
} as const;

export const maximizeBtn = style({
  ...btn,
  backgroundColor: 'rgb(100, 255, 100)',
});

export const minimizeBtn = style({
  ...btn,
  backgroundColor: 'rgb(100, 100, 255)',
});

export const closeBtn = style({
  ...btn,
  backgroundColor: 'rgb(255,100, 100)',
});

export const navigatorArrowContainer = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '0.5rem',
});

export const navigatorArrowStyleRule: StyleRule = {
  width: '1.75rem',
  height: '1.75rem',
  cursor: 'pointer',
} as const;

export const navigatorArrow = style({
  ...navigatorArrowStyleRule,
});

export const navigatorArrowDisabled = style({
  ...navigatorArrowStyleRule,
  color: 'gray',
});
