import { create } from 'zustand';

type State = {
  selectedKeys: string[];
  renamingKey: string | null;
};

type Action = {
  selectKey: (key: string) => void;
  unselectKey: (key: string) => void;
  unselectAllKeys: () => void;
  isSelected: (key: string) => boolean;
  setRenamingKey: (key: string | null) => void;
};

const initialState: State = {
  selectedKeys: [],
  renamingKey: null,
};

export const useMobileElementStore = create<State & Action>((set, get) => ({
  selectedKeys: initialState.selectedKeys,
  renamingKey: initialState.renamingKey,
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
  setRenamingKey: (key) => {
    set({ renamingKey: key });
  },
}));
