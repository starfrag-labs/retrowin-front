import { create } from 'zustand';

type State = {
  menuRef: React.RefObject<HTMLElement> | null;
};

type Action = {
  setMenuRef: (ref: React.RefObject<HTMLElement>) => void;
};

const initialState: State = {
  menuRef: null,
};

export const useRefStore = create<State & Action>((set) => ({
  menuRef: initialState.menuRef,

  setMenuRef: (ref) => {
    set({ menuRef: ref });
  },
}));
