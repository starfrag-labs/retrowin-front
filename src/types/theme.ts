export type Theme = 'default' | 'light' | 'dark';

export const isTheme = (theme: string): theme is Theme => {
  return ['default', 'light', 'dark'].includes(theme);
}