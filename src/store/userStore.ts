import { Theme, isTheme } from '../types/theme';
import { create } from 'zustand';

const getThemeFromLocalStorage = (): Theme => {
  const theme = localStorage.getItem('theme');
  if (theme === null) return 'default';
  if (isTheme(theme)) return theme;
  return 'default';
};

type UserState = 'pending' | 'loggedIn' | 'loggedOut';

type State = {
  theme: Theme;
  loggedIn: UserState;
  accessToken?: string;
};

type Action = {
  updateTheme: (theme: Theme) => void;
  updateLoggedIn: (userState: UserState) => void;
  updateAccessToken: (accessToken: string) => void;
};

const initialState: State = {
  theme: getThemeFromLocalStorage(),
  loggedIn: 'pending',
};

export const useUserStore = create<State & Action>((set) => ({
  theme: initialState.theme,
  loggedIn: initialState.loggedIn,
  updateTheme: (theme) => set({ theme }),
  updateLoggedIn: (loggedIn) => set({ loggedIn }),
  updateAccessToken: (accessToken) => set({ accessToken }),
}));
