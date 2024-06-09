import { Theme } from "../../types/theme";

export const isTheme = (theme: string): theme is Theme => {
  return ['default', 'light', 'dark'].includes(theme);
}