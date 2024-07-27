import { create } from 'zustand';

type State = {
  navigatorElementRefs: Map<string, React.RefObject<HTMLElement>>;
  backgroundWindowRef: React.RefObject<HTMLElement> | null;
  windowRefs: Map<string, React.RefObject<HTMLElement>>;
  menuRef: React.RefObject<HTMLElement> | null;
};

type Action = {
  setNavigatorElementRef: (
    key: string,
    ref: React.RefObject<HTMLElement>
  ) => void;
  getNavigatorElementRefByKey: (
    key: string
  ) => React.RefObject<HTMLElement> | undefined;
  setBackgroundWindowRef: (ref: React.RefObject<HTMLElement>) => void;
  setWindowRef: (key: string, ref: React.RefObject<HTMLElement>) => void;
  getWindowByKey: (key: string) => React.RefObject<HTMLElement> | undefined;
  setMenuRef: (ref: React.RefObject<HTMLElement>) => void;
};

const initialState: State = {
  navigatorElementRefs: new Map(),
  backgroundWindowRef: null,
  windowRefs: new Map(),
  menuRef: null,
};

export const useRefStore = create<State & Action>((set, get) => ({
  navigatorElementRefs: initialState.navigatorElementRefs,
  windowRefs: initialState.windowRefs,
  backgroundWindowRef: initialState.backgroundWindowRef,
  menuRef: initialState.menuRef,
  setNavigatorElementRef: (key, ref) => {
    set((state) => {
      if (state.navigatorElementRefs) {
        state.navigatorElementRefs.set(key, ref);
      }
      return { navigatorElementRefs: state.navigatorElementRefs };
    });
  },
  getNavigatorElementRefByKey: (key) => {
    return get().navigatorElementRefs.get(key);
  },
  setBackgroundWindowRef: (ref) => {
    set({ backgroundWindowRef: ref });
  },
  setWindowRef: (key, ref) => {
    set((state) => {
      if (state.windowRefs) {
        state.windowRefs.set(key, ref);
      }
      return { windowRefs: state.windowRefs };
    });
  },
  getWindowByKey: (key) => {
    return get().windowRefs.get(key);
  },
  setMenuRef: (ref) => {
    set({ menuRef: ref });
  },
}));
