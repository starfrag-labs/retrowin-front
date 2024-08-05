import { create } from "zustand";
import { darkTheme, lightTheme } from "../styles/themes/theme.css";

export const themes = [lightTheme, darkTheme];
export type ThemeKey = 'light' | 'dark';

type State = {
  theme: string;
}

type Action = {
  setTheme: (themeKey: ThemeKey) => void;
  toggleTheme: () => void;
  getCurrentThemeKey: () => ThemeKey;
};

const initialState: State = {
  theme: themes[0],
}

export const useThemeStore = create<State & Action>((set, get) => ({
  theme: initialState.theme,
  setTheme: (themeKey) => {
    window.localStorage.setItem('theme', themeKey);
    switch (themeKey) {
      case 'light':
        set({ theme: themes[0] });
        break;
      case 'dark':
        set({ theme: themes[1] });
        break;
    }
  },
  toggleTheme: () => {
    set((state) => {
      const themeIndex = themes.indexOf(state.theme);
      const nextThemeIndex = themeIndex === themes.length - 1 ? 0 : themeIndex + 1;
      return { theme: themes[nextThemeIndex] };
    });
  },
  getCurrentThemeKey: () => {
    const theme = get().theme;
    switch (theme) {
      case themes[0]:
        return 'light';
      case themes[1]:
        return 'dark';
      default:
        return 'light';
    }
  }
}));
