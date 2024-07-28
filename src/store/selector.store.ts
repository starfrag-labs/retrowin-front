import { create } from 'zustand';

type State = {
  rect: DOMRect | null;
  currentWindowKey: string | null;
  shiftKey: boolean;
};

type Action = {
  setRect: (rect: DOMRect | null) => void;
  setCurrentWindowKey: (key: string | null) => void;
  setShiftKey: (shiftKey: boolean) => void;
};

const initialState: State = {
  rect: null,
  currentWindowKey: null,
  shiftKey: false,
};

export const useSelectorStore = create<State & Action>((set) => ({
  rect: initialState.rect,
  currentWindowKey: initialState.currentWindowKey,
  shiftKey: initialState.shiftKey,
  setRect: (rect) => {
    set({ rect });
  },
  setCurrentWindowKey: (key) => {
    set({ currentWindowKey: key });
  },
  setShiftKey: (shiftKey) => {
    set({ shiftKey });
  },
}));
