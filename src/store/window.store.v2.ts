import { create } from 'zustand';
import { IWindowV2 } from '../types/window';

type State = {
  windows: IWindowV2[];
};

type Action = {
  newWindow: (targetKey: string, type: IWindowV2['type']) => void;
  updateWindow: (key: string, targetKey: string) => void;
  findWindow: (targetKey: string) => IWindowV2 | undefined;
  closeWindow: (key: string) => void;
  highlightWindow: (key: string) => void;
};

const initialState: State = {
  windows: [],
};

export const useWindowStoreV2 = create<State & Action>((set, get) => ({
  windows: initialState.windows,
  newWindow: (targetKey, type) => {
    set((state) => {
      const filteredWindows = state.windows.filter(
        (w) => w.targetKey !== targetKey
      );
      const newWindow: IWindowV2 = {
        key: Math.random().toString(36).substring(7),
        targetKey: targetKey,
        type,
      };
      state.windows = [...filteredWindows, newWindow];
      return { windows: state.windows };
    });
  },
  updateWindow: (key, targetKey) => {
    set((state) => {
      const window = state.windows.find((w) => w.key === key);
      if (window) {
        window.targetKey = targetKey;
      }
      return { windows: state.windows };
    });
  },
  findWindow: (targetKey) => {
    return get().windows.find((w) => w.targetKey === targetKey);
  },
  closeWindow: (key) => {
    set((state) => {
      state.windows = state.windows.filter((w) => w.key !== key);
      return { windows: state.windows };
    });
  },
  highlightWindow: (key) => {
    set((state) => {
      const window = state.windows.find((w) => w.key === key);
      if (window) {
        const filteredWindows = state.windows.filter((w) => w.key !== key);
        state.windows = [...filteredWindows, window];
      }
      return { windows: state.windows };
    });
  },
}));
