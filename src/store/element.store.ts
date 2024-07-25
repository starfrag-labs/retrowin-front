import { create } from 'zustand';

type ElementInfo = {
  key: string;
  type: 'file' | 'folder' | 'upload';
  name: string;
  parentKey: string;
};

type State = {
  selectedKeys: string[];
  renamingKey: string | null;
  info: Map<string, ElementInfo>;
};

type Action = {
  selectKey: (key: string) => void;
  unselectKey: (key: string) => void;
  unselectAllKeys: () => void;
  isSelected: (key: string) => boolean;
  setRenamingKey: (key: string | null) => void;
  setElementInfo: (key: string, info: ElementInfo) => void;
  getElementInfo: (key: string) => ElementInfo | undefined;
  getElementInfoByParentKey: (parentKey: string) => ElementInfo[];
};

const initialState: State = {
  selectedKeys: [],
  renamingKey: null,
  info: new Map(),
};

export const useElementStore = create<State & Action>((set, get) => ({
  selectedKeys: initialState.selectedKeys,
  renamingKey: initialState.renamingKey,
  info: initialState.info,
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
  setElementInfo: (key, info) => {
    set((state) => {
      state.info.set(key, info);
      return { info: state.info };
    });
  },
  getElementInfo: (key) => {
    return get().info.get(key);
  },
  getElementInfoByParentKey: (parentKey) => {
    return Array.from(get().info.values()).filter(
      (info) => info.parentKey === parentKey
    );
  },
}));
