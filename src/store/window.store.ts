import { AppWindow, WindowType } from "@/interfaces/window";
import { createWindowKey } from "@/utils/random_key";
import { create } from "zustand";

type State = {
  windows: AppWindow[];
  currentWindow: {
    key: string;
    windowRef: React.RefObject<HTMLElement>;
    contentRef: React.RefObject<HTMLElement> | null;
    headerRef: React.RefObject<HTMLElement> | null;
  } | null;
  backgroundWindow: {
    key: string;
    targetKey: string;
    ref: React.RefObject<HTMLElement>;
  } | null;
  mouseEnter: boolean;
};

type Action = {
  newWindow: (targetKey: string, type: WindowType, title: string) => void;
  updateWindow: (key: string, targetKey: string) => void;
  findWindow: (key: string) => AppWindow | undefined;
  findWindowByTarget: (targetKey: string) => AppWindow | undefined;
  closeWindow: (key: string) => void;
  highlightWindow: (key: string) => void;
  prevWindow: (key: string) => void;
  nextWindow: (key: string) => void;
  setTitle: (key: string, title: string) => void;

  // current window
  setCurrentWindow: (
    window: {
      key: string;
      windowRef: React.RefObject<HTMLElement>;
      contentRef: React.RefObject<HTMLElement>;
      headerRef: React.RefObject<HTMLElement>;
    } | null,
  ) => void;

  // window ref
  setBackgroundWindow: (window: State["backgroundWindow"]) => void;

  // mouse enter
  setMouseEnter: (enter: boolean) => void;
};

const initialState: State = {
  windows: [],
  currentWindow: null,
  mouseEnter: false,
  backgroundWindow: null,
};

export const useWindowStore = create<State & Action>((set, get) => ({
  windows: initialState.windows,
  currentWindow: initialState.currentWindow,
  backgroundWindow: initialState.backgroundWindow,
  mouseEnter: initialState.mouseEnter,
  newWindow: (targetKey, type, title) => {
    set((state) => {
      const existingWindow = state.windows.find(
        (w) => w.targetKey === targetKey,
      );
      if (existingWindow) {
        // highlight existing window
        const filteredWindows = state.windows.filter(
          (w) => w.targetKey !== targetKey,
        );
        state.windows = [...filteredWindows, existingWindow];
        return { windows: state.windows };
      } else {
        // create new window
        const newWindow: AppWindow = {
          key: createWindowKey(),
          title: title || "New Window",
          targetKey: targetKey,
          type,
        };
        if (type === "navigator") {
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
      if (window && window.targetKey === targetKey) {
        return { windows: state.windows };
      } else if (window) {
        window.targetKey = targetKey;
      }
      if (
        window?.type === "navigator" &&
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
        window?.type === "navigator" &&
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
        window?.type === "navigator" &&
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
  setTitle: (key, title) => {
    set((state) => {
      const window = state.windows.find((w) => w.key === key);
      if (window) {
        window.title = title;
        state.windows = [...state.windows];
      }
      return { windows: state.windows };
    });
  },

  // current window
  setCurrentWindow: (window) => {
    set({ currentWindow: window });
  },

  // window ref
  setBackgroundWindow: (window) => {
    set({ backgroundWindow: window });
  },

  // mouse enter
  setMouseEnter: (enter) => {
    set({ mouseEnter: enter });
  },
}));
