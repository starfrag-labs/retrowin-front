import { create } from 'zustand';

type State = {
  accessToken?: string;
};

type Action = {
  setAccessToken: (accessToken: string) => void;
};

const initialState: State = {};

export const useTokenStore = create<State & Action>((set) => ({
  accessToken: initialState.accessToken,
  setAccessToken: (accessToken) => set({ accessToken }),
}));
