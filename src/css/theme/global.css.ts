import { createGlobalTheme } from '@vanilla-extract/css';

export const colors = createGlobalTheme(':root', {
  primary: {
    100: 'hsl(0 100% 97%)',
    200: 'hsl(0 100% 92%)',
    300: 'hsl(0 100% 87%)',
    400: 'hsl(0 100% 82%)',
    500: 'hsl(0 100% 77%)',
    600: 'hsl(0 100% 72%)',
    700: 'hsl(0 100% 67%)',
    800: 'hsl(0 100% 62%)',
    900: 'hsl(0 100% 57%)',
  },
  grey: {
    50: 'hsl(0 0% 98%)',
    100: 'hsl(0 0% 96%)',
    200: 'hsl(0 0% 93%)',
    300: 'hsl(0 0% 89%)',
    400: 'hsl(0 0% 85%)',
    500: 'hsl(0 0% 80%)',
    600: 'hsl(0 0% 75%)',
    700: 'hsl(0 0% 70%)',
    800: 'hsl(0 0% 60%)',
    900: 'hsl(0 0% 50%)',
  },
  black: '#000',
  white: '#fff',
  shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
});

export const margins = createGlobalTheme(':root', {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
});

export const fontSizes = createGlobalTheme(':root', {
  default: 'clamp(16px, 1.5rem, 2.5rem)',
  small: 'clamp(12px, 1rem, 1.5rem)',
  big: 'clamp(20px, 2rem, 3rem)',
  title: 'clamp(24px, 3rem, 4rem)',
  h1: 'clamp(32px, 4rem, 5rem)',
  h2: 'clamp(24px, 3rem, 4rem)',
  h3: 'clamp(20px, 2.5rem, 3rem)',
  h4: 'clamp(16px, 2rem, 2.5rem)',
  h5: 'clamp(14px, 1.5rem, 2rem)',
});