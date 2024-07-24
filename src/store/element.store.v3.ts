import { create } from "zustand";

type State = {
  selectedKeys: string[];
};

type Action = {
  selectKey: (key: string) => void;
  unselectKey: (key: string) => void;
  unselectAllKeys: () => void;
  isSelected: (key: string) => boolean;
};

const initialState: State = {
  selectedKeys: [],
};

export const useMobileElementStore = create<State & Action>((set, get) => ({
  selectedKeys: initialState.selectedKeys,
  selectKey: (key) => {
    set((state) => {
      if (!state.selectedKeys.includes(key)) {
        state.selectedKeys = [...state.selectedKeys, key];
      }
      return { selectedKeys: state.selectedKeys };
    });
  },
  unselectKey: (key) => {
    set((state) => {
      state.selectedKeys = state.selectedKeys.filter(
        (selectedKey) => selectedKey !== key
      );
      return { selectedKeys: state.selectedKeys };
    });
  },
  unselectAllKeys: () => {
    set({ selectedKeys: [] });
  },
  isSelected: (key) => {
    return get().selectedKeys.includes(key);
  },
}));