import { create } from "zustand";
import { IWindow } from "../types/window";

type State = {
  windows: Map<string, IWindow>;
  order: string[];
}

type Action = {
  getWindow: (key: string) => IWindow | undefined;
  newWindow: (key: string, type: IWindow['type'],) => void;
  minimizeWindow: (key: string) => void;
  maximizeWindow: (key: string) => void;
  closeWindow: (key: string) => void;
  moveForward: (key: string) => void; 
}

const initialState: State = {
  windows: new Map<string, IWindow>(),
  order: [],
}

export const useWindowStore = create<State & Action>((set, get) => ({
  windows: initialState.windows,
  order: initialState.order,
  // Window functions
  getWindow: (key) => get().windows.get(key),
  newWindow: (key, type) => {
    set((state) => {
      state.windows.set(key, { key, type, minimized: false });
      state.order.push(key);
      return { windows: state.windows, order: state.order };
    });
  },
  minimizeWindow: (key) => {
    set((state) => {
      const window = state.windows.get(key);
      if (window) {
        window.minimized = true;
        state.windows.set(key, window);
        state.order = state.order.filter((k) => k !== key);
        state.order.unshift(key);
      }
      return { windows: state.windows, order: state.order };
    });
  },
  maximizeWindow: (key) => {
    set((state) => {
      const window = state.windows.get(key);
      if (window) {
        window.minimized = false;
        state.windows.set(key, window);
        state.order = state.order.filter((k) => k !== key);
        state.order.push(key);
      }
      return { windows: state.windows, order: state.order };
    });
  },
  closeWindow: (key) => {
    set((state) => {
      state.windows.delete(key);
      state.order = state.order.filter((k) => k !== key);
      return { windows: state.windows, order: state.order };
    });
  },
  moveForward: (key) => {
    set((state) => {
      state.order = state.order.filter((k) => k !== key);
      state.order.push(key);
      return { windows: state.windows, order: state.order };
    });
  }
}));