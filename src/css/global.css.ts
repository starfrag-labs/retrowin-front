import { createGlobalTheme } from '@vanilla-extract/css';

export const primaryColor = (hue: number, saturation: number) => {
  const reverseHue = (hue + 100) % 360;
  return {
    100: `hsl(${hue}, ${saturation}%, 95%)`,
    200: `hsl(${hue}, ${saturation}%, 85%)`,
    300: `hsl(${hue}, ${saturation}%, 75%)`,
    400: `hsl(${hue}, ${saturation}%, 65%)`,
    500: `hsl(${hue}, ${saturation}%, 55%)`,
    600: `hsl(${hue}, ${saturation}%, 45%)`,
    700: `hsl(${hue}, ${saturation}%, 35%)`,
    800: `hsl(${hue}, ${saturation}%, 25%)`,
    900: `hsl(${hue}, ${saturation}%, 15%)`,
    r100: `hsl(${reverseHue}, ${saturation}%, 95%)`,
    r200: `hsl(${reverseHue}, ${saturation}%, 85%)`,
    r300: `hsl(${reverseHue}, ${saturation}%, 75%)`,
    r400: `hsl(${reverseHue}, ${saturation}%, 65%)`,
    r500: `hsl(${reverseHue}, ${saturation}%, 55%)`,
    r600: `hsl(${reverseHue}, ${saturation}%, 45%)`,
    r700: `hsl(${reverseHue}, ${saturation}%, 35%)`,
    r800: `hsl(${reverseHue}, ${saturation}%, 25%)`,
    r900: `hsl(${reverseHue}, ${saturation}%, 15%)`,
  }
}

export const colors = createGlobalTheme(':root', {
  grey: {
    50: 'hsl(0 0% 95%)',
    100: 'hsl(0 0% 90%)',
    200: 'hsl(0 0% 80%)',
    300: 'hsl(0 0% 70%)',
    400: 'hsl(0 0% 60%)',
    500: 'hsl(0 0% 50%)',
    600: 'hsl(0 0% 40%)',
    700: 'hsl(0 0% 30%)',
    800: 'hsl(0 0% 20%)',
    900: 'hsl(0 0% 10%)',
  },
  black: '#000',
  white: '#fff',
  shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  text: '#0f172a',
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
  default: '100%',
  small: 'clamp(0.875rem, 1.5vw, 1.5rem)',
  big: 'clamp(20px, 2rem, 3rem)',
  title: 'clamp(24px, 3rem, 4rem)',
  h1: 'clamp(2rem, 5vw, 5rem)',
  h2: 'clamp(1.5rem, 3vw, 3rem)',
  h3: 'clamp(1.25rem, 2.5vw, 2.5rem)',
  h4: 'clamp(1rem, 2vw, 2rem)',
  h5: 'clamp(0.875rem, 1.5vw, 1.5rem)',
});

export const paddings = createGlobalTheme(':root', {
  default: '10px',
  small: '5px',
  big: '20px',
  large: '30px',
  huge: '40px',
});

export const boxShadow = createGlobalTheme(':root', {
  shadow1: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  shadow2: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadow3: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  shadow4: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
});