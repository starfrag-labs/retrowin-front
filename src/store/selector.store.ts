import { create } from 'zustand';

type State = {
  rect: DOMRect | null;
  currentWindowKey: string | null;
};

type Action = {
  setRect: (rect: DOMRect | null) => void;
  setCurrentWindowKey: (key: string | null) => void;
};

const initialState: State = {
  rect: null,
  currentWindowKey: null,
};

export const useSelectorStore = create<State & Action>((set) => ({
  rect: initialState.rect,
  currentWindowKey: initialState.currentWindowKey,
  setRect: (rect) => {
    set({ rect });
  },
  setCurrentWindowKey: (key) => {
    set({ currentWindowKey: key });
  },
}));
