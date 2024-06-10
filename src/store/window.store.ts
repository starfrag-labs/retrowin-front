import { create } from "zustand";
import { IWindow } from "../types/window";

type State = {
  windows: Map<string, IWindow>;
}

type Action = {
  getWindows: () => Map<string, IWindow>;
  getWindow: (key: string) => IWindow | undefined;
  setWindows: (windows: IWindow[]) => void;
  setWindow: (window: IWindow) => void;
  removeWindow: (key: string) => void;
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
  getWindows: () => get().windows,
  getWindow: (key) => get().windows.get(key),
  setWindows: (windows) => {
    set((state) => {
      windows.forEach((window) => {
        state.windows.set(window.key, window);
      });
      return { windows: state.windows };
    });
  },
  setWindow: (window) => {
    set((state) => {
      state.windows.set(window.key, window);
      return { windows: state.windows };
    });
  },
  removeWindow: (key) => {
    set((state) => {
      state.windows.delete(key);
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