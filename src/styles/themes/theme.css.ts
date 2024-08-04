import { createTheme, createThemeContract } from '@vanilla-extract/css';

export const theme = createThemeContract({
  text: {
    normal: '',
    light: '',
    dark: '',
  },
  border: {
    normal: '',
    light: '',
    bold: '',
  },
  primary: {
    normal: '',
    dark: '',
    light: '',
  },
  logo: {
    gradStart: '',
    gradEnd: '',
    stroke: '',
  },
  highlight: {
    h1: '',
    h2: '',
    h3: '',
  },
  icon: {
    upload: '',
    file: '',
    folder: '',
  }
});

export const darkTheme = createTheme(theme, {
  text: {
    normal: '#f0f0f0',
    light: '#ffffff',
    dark: '#e0e0e0',
  },
  border: {
    normal: '1px solid #f0f0f0',
    light: '1px solid #e0e0e0',
    bold: '2px solid #f0f0f0',
  },
  primary: {
    normal: '#424242',
    dark: '#2e2e2e',
    light: '#6e6e6e',
  },
  logo: {
    gradStart: '#00C3F1',
    gradEnd: '#00a8f0',
    stroke: '#fff',
  },
  highlight: {
    h1: 'rgba(255, 255, 255, 0.1)',
    h2: 'rgba(255, 255, 255, 0.2)',
    h3: 'rgba(255, 255, 255, 0.3)',
  },
  icon: {
    upload: 'lightblue',
    file: 'lightgrey',
    folder: 'orange',
  },
});

export const lightTheme = createTheme(theme, {
  text: {
    normal: '#2e2e2e',
    light: '#000000',
    dark: '#4e4e4e',
  },
  border: {
    normal: '1px solid #000',
    light: '1px solid #ccc',
    bold: '2px solid #000',
  },
  primary: {
    normal: '#ffffff',
    dark: '#e0e0e0',
    light: '#ffffff',
  },
  logo: {
    gradStart: '#00aad2',
    gradEnd: '#008cbb',
    stroke: '#000',
  },
  highlight: {
    h1: 'rgba(0, 0, 0, 0.05)',
    h2: 'rgba(0, 0, 0, 0.1)',
    h3: 'rgba(0, 0, 0, 0.2)',
    
  },
  icon: {
    upload: 'lightblue',
    file: 'lightgrey',
    folder: 'orange',
  }
});
