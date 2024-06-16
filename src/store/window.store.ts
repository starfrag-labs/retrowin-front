import { create } from 'zustand';
import { IWindow } from '../types/window';

type State = {
  windows: IWindow[];
};

type Action = {
  newWindow: (key: string, type: IWindow['type']) => void;
  findWindow: (key: string) => IWindow | undefined;
  minimizeWindow: (key: string) => void;
  highlightWindow: (key: string) => void;
  closeWindow: (key: string) => void;
};

const initialState: State = {
  windows: [],
};

export const useWindowStore = create<State & Action>((set, get) => ({
  windows: initialState.windows,
  // Window functions
  newWindow: (key, type) => {
    set((state) => {
      const filteredWindows = state.windows.filter((w) => w.key !== key);
      const newWindow: IWindow = {
        key,
        type,
        minimized: false,
      };
      state.windows = [newWindow, ...filteredWindows];
      return { windows: state.windows };
    });
  },
  findWindow: (key) => {
    return get().windows.find((w) => w.key === key);
  },
  minimizeWindow: (key) => {
    set((state) => {
      const window = state.windows.find((w) => w.key === key);
      if (window) {
        window.minimized = true;
      }
      return { windows: state.windows };
    });
  },
  highlightWindow: (key) => {
    set((state) => {
      const window = state.windows.find((w) => w.key === key);
      if (window) {
        window.minimized = false;
        const filteredWindows = state.windows.filter((w) => w.key !== key);
        state.windows = [window, ...filteredWindows];
      }
      return { windows: state.windows };
    });
  },
  closeWindow: (key) => {
    set((state) => {
      state.windows = state.windows.filter((w) => w.key !== key);
      return { windows: state.windows };
    });
  },
}));
