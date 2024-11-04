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
  mouseEnter: boolean;
};

type Action = {
  newWindow: ({
    targetKey,
    type,
    title,
    key,
  }: {
    targetKey: string;
    type: WindowType;
    title: string;
    key?: string;
  }) => void;
  updateWindow: ({
    targetWindowKey,
    type,
    targetFileKey,
    title,
  }: {
    targetWindowKey: string;
    type?: WindowType;
    targetFileKey: string;
    title?: string;
  }) => void;
  findWindow: (key: string) => AppWindow | undefined;
  findWindowByTarget: (targetKey: string) => AppWindow | undefined;
  closeWindow: (key: string) => void;
  highlightWindow: (key: string) => void;
  highlightWindowsByType: (type: WindowType) => void;
  prevWindow: (key: string) => void;
  nextWindow: (key: string) => void;
  setTitle: (key: string, title: string) => void;
  getBackgroundWindow: () => AppWindow | undefined;

  // current window
  setCurrentWindow: (window: State["currentWindow"] | null) => void;

  // mouse enter
  setMouseEnter: (enter: boolean) => void;
};

const initialState: State = {
  windows: [],
  currentWindow: null,
  mouseEnter: false,
};

export const useWindowStore = create<State & Action>((set, get) => ({
  windows: initialState.windows,
  currentWindow: initialState.currentWindow,
  mouseEnter: initialState.mouseEnter,
  newWindow: ({ targetKey, type, title, key }) => {
    set((state) => {
      const existingWindow = state.windows.find(
        (w) => w.targetKey === targetKey && w.type === type,
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
          key: key || createWindowKey(),
          title: title || "New Window",
          targetKey: targetKey,
          type,
        };
        if (type === WindowType.Navigator) {
          newWindow.targetHistory = [targetKey];
          newWindow.historyIndex = 0;
        }
        state.windows = [...state.windows, newWindow];
        return { windows: state.windows };
      }
    });
  },
  updateWindow: ({ targetWindowKey, type, targetFileKey, title }) => {
    set((state) => {
      const window = state.windows.find((w) => w.key === targetWindowKey);
      if (
        window &&
        window.targetKey === targetFileKey &&
        window.type === type
      ) {
        return { windows: state.windows };
      } else if (window) {
        window.targetKey = targetFileKey;
        if (type) {
          window.type = type;
        }
        if (title) {
          window.title = title;
        }
      }
      if (window && window.targetHistory && window.historyIndex !== undefined) {
        window.targetHistory = [
          ...window.targetHistory.slice(0, window.historyIndex + 1),
          targetFileKey,
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
  highlightWindowsByType: (type) => {
    set((state) => {
      const windows = [
        ...state.windows.filter((w) => w.type !== type),
        ...state.windows.filter((w) => w.type === type),
      ];
      return { windows };
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
  getBackgroundWindow: () => {
    return get().windows.find((w) => w.type === WindowType.Background);
  },

  // current window
  setCurrentWindow: (window) => {
    set({ currentWindow: window });
  },

  // mouse enter
  setMouseEnter: (enter) => {
    set({ mouseEnter: enter });
  },
}));
