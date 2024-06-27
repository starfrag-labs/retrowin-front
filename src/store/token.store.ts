import { create } from 'zustand';

type State = {
  accessToken: string;
  requestCount: number;
};

type Action = {
  setAccessToken: (accessToken: string) => void;
  incrementRequestCount: () => void;
  resetRequestCount: () => void;
};

const initialState: State = {
  accessToken: '',
  requestCount: 0,
};

export const useTokenStore = create<State & Action>((set) => ({
  accessToken: initialState.accessToken,
  requestCount: initialState.requestCount,
  setAccessToken: (accessToken) => set({ accessToken }),
  incrementRequestCount: () => set((state) => ({ requestCount: state.requestCount + 1 })),
  resetRequestCount: () => set({ requestCount: 0 }),
}));
