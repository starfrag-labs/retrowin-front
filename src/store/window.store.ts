import { create } from "zustand";
import { IWindow } from "../types/window";

type State = {
  windows: Map<string, IWindow>;
  windowOrder: string[];
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
  windowOrder: [],
}

export const useWindowStore = create<State & Action>((set, get) => ({
  windows: initialState.windows,
  windowOrder: initialState.windowOrder,
  // Window functions
  getWindow: (key) => get().windows.get(key),
  newWindow: (key, type) => {
    set((state) => {
      state.windows.set(key, { key, type, minimized: false });
      state.windowOrder = [key, ...state.windowOrder];
      return { windows: state.windows, windowOrder: state.windowOrder};
    });
  },
  minimizeWindow: (key) => {
    set((state) => {
      const window = state.windows.get(key);
      if (window) {
        window.minimized = true;
        state.windows.set(key, window);
        state.windowOrder = state.windowOrder.filter((k) => k !== key);
        state.windowOrder.push(key);
      }
      return { windows: state.windows, windowOrder: state.windowOrder };
    });
  },
  maximizeWindow: (key) => {
    set((state) => {
      const window = state.windows.get(key);
      if (window) {
        window.minimized = false;
        state.windows.set(key, window);
      }
      return { windows: state.windows, windowOrder: state.windowOrder};
    });
  },
  closeWindow: (key) => {
    set((state) => {
      state.windows.delete(key);
      state.windowOrder = state.windowOrder.filter((k) => k !== key);
      return { windows: state.windows, windowOrder: state.windowOrder};
    });
  },
}));