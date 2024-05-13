import { create } from "zustand";

type State = {
  accessToken?: string;
}

type Action = {
  updateAccessToken: (accessToken: string) => void;
}

const initialState: State = {};

export const useTokenStore = create<State & Action>((set) => ({
  accessToken: initialState.accessToken,
  updateAccessToken: (accessToken) => set({ accessToken }),
}));