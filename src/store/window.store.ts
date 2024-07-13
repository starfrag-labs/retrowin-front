import { create } from 'zustand';
import { IWindow } from '../types/window';

type State = {
  windows: IWindow[];
};

type Action = {
  newWindow: (targetKey: string, type: IWindow['type']) => void;
  updateWindow: (key: string, targetKey: string) => void;
  findWindow: (key: string) => IWindow | undefined;
  findWindowByTarget: (targetKey: string) => IWindow | undefined;
  closeWindow: (key: string) => void;
  highlightWindow: (key: string) => void;
  prevWindow: (key: string) => void;
  nextWindow: (key: string) => void;
};

const initialState: State = {
  windows: [],
};

export const useWindowStore = create<State & Action>((set, get) => ({
  windows: initialState.windows,
  newWindow: (targetKey, type) => {
    set((state) => {
      const existingWindow = state.windows.find(
        (w) => w.targetKey === targetKey
      );
      if (existingWindow) {
        // highlight existing window
        const filteredWindows = state.windows.filter(
          (w) => w.targetKey !== targetKey
        );
        state.windows = [...filteredWindows, existingWindow];
        return { windows: state.windows };
      } else {
        // create new window
        const newWindow: IWindow = {
          key: Math.random().toString(36).substring(7),
          targetKey: targetKey,
          type,
        };
        if (type === 'navigator') {
          newWindow.targetHistory = [targetKey];
          newWindow.historyIndex = 0;
        }
        state.windows = [...state.windows, newWindow];
        return { windows: state.windows };
      }
    });
  },
  updateWindow: (key, targetKey) => {
    set((state) => {
      const window = state.windows.find((w) => w.key === key);
      if (window) {
        window.targetKey = targetKey;
      }
      if (
        window?.type === 'navigator' &&
        window.targetHistory &&
        window.historyIndex !== undefined
      ) {
        window.targetHistory = [
          ...window.targetHistory.slice(0, window.historyIndex + 1),
          targetKey,
        ];
        window.historyIndex = window.targetHistory.length - 1;
      }
      state.windows = [...state.windows];
      return { windows: state.windows };
    });
  },
  findWindow(key) {
    return get().windows.find((w) => w.key === key);
  },
  findWindowByTarget: (targetKey) => {
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
  prevWindow: (key) => {
    set((state) => {
      const window = state.windows.find((w) => w.key === key);
      if (
        window?.type === 'navigator' &&
        window.targetHistory &&
        window.historyIndex !== undefined
      ) {
        if (window.historyIndex > 0) {
          window.historyIndex -= 1;
          window.targetKey = window.targetHistory[window.historyIndex];
          state.windows = [...state.windows];
        }
      }
      return { windows: state.windows };
    });
  },
  nextWindow: (key) => {
    set((state) => {
      const window = state.windows.find((w) => w.key === key);
      if (
        window?.type === 'navigator' &&
        window.targetHistory &&
        window.historyIndex !== undefined
      ) {
        if (window.historyIndex < window.targetHistory.length - 1) {
          window.historyIndex += 1;
          window.targetKey = window.targetHistory[window.historyIndex];
          state.windows = [...state.windows];
        }
      }
      return { windows: state.windows };
    });
  },
}));
