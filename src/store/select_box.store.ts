import { create } from "zustand";

type State = {
  rect: DOMRect | null;
};

type Action = {
  setRect: (rect: DOMRect | null) => void;
};

const initialState: State = {
  rect: null,
};

export const useSelectBoxStore = create<State & Action>((set) => ({
  rect: initialState.rect,
  setRect: (rect) => {
    set({ rect });
  },
}));
