import { create } from "zustand";

type State = {
  menuRef: React.RefObject<HTMLElement | null> | null;
};

type Action = {
  setMenuRef: (ref: React.RefObject<HTMLElement | null>) => void;
};

const initialState: State = {
  menuRef: null,
};

export const useMenuStore = create<State & Action>((set) => ({
  menuRef: initialState.menuRef,

  setMenuRef: (ref) => {
    set({ menuRef: ref });
  },
}));
