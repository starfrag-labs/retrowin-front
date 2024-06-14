import { create } from "zustand";
import { IWindow } from "../types/window";

type State = {
  windows: Map<string, IWindow>;
}

type Action = {
  getWindow: (key: string) => IWindow | undefined;
  newWindow: (key: string, type: IWindow['type'],) => void;
  minimizeWindow: (key: string) => void;
  maximizeWindow: (key: string) => void;
  closeWindow: (key: string) => void;
}

const initialState: State = {
  windows: new Map<string, IWindow>(),
}

export const useWindowStore = create<State & Action>((set, get) => ({
  windows: initialState.windows,
  // Window functions
  getWindow: (key) => get().windows.get(key),
  newWindow: (key, type) => {
    set((state) => {
      state.windows.set(key, { key, type, minimized: false });
      return { windows: state.windows };
    });
  },
  minimizeWindow: (key) => {
    set((state) => {
      const window = state.windows.get(key);
      if (window) {
        window.minimized = true;
        state.windows.set(key, window);
      }
      return { windows: state.windows };
    });
  },
  maximizeWindow: (key) => {
    set((state) => {
      const window = state.windows.get(key);
      if (window) {
        window.minimized = false;
        state.windows.set(key, window);
      }
      return { windows: state.windows };
    });
  },
  closeWindow: (key) => {
    set((state) => {
      state.windows.delete(key);
      return { windows: state.windows };
    });
  },
}));