import { create } from 'zustand';

type State = {
  elementsRef: Map<string, React.RefObject<HTMLElement>>;
  backgroundWindowRef: React.RefObject<HTMLElement> | null;
  windowsRef: Map<string, React.RefObject<HTMLElement>>;
};

type Action = {
  setElementRef: (key: string, ref: React.RefObject<HTMLElement>) => void;
  getElementByKey: (key: string) => React.RefObject<HTMLElement> | undefined;
  setBackgroundWindowRef: (ref: React.RefObject<HTMLElement>) => void;
  setWindowRef: (key: string, ref: React.RefObject<HTMLElement>) => void;
  getWindowByKey: (key: string) => React.RefObject<HTMLElement> | undefined;
};

const initialState: State = {
  elementsRef: new Map(),
  backgroundWindowRef: null,
  windowsRef: new Map(),
};

export const useRefStore = create<State & Action>((set, get) => ({
  elementsRef: initialState.elementsRef,
  windowsRef: initialState.windowsRef,
  backgroundWindowRef: initialState.backgroundWindowRef,
  setElementRef: (key, ref) => {
    set((state) => {
      if (state.elementsRef) {
        state.elementsRef.set(key, ref);
      }
      return { elementsRef: state.elementsRef };
    });
  },
  getElementByKey: (key) => {
    return get().elementsRef.get(key);
  },
  setBackgroundWindowRef: (ref) => {
    set({ backgroundWindowRef: ref });
  },
  setWindowRef: (key, ref) => {
    set((state) => {
      if (state.windowsRef) {
        state.windowsRef.set(key, ref);
      }
      return { windowsRef: state.windowsRef };
    });
  },
  getWindowByKey: (key) => {
    return get().windowsRef.get(key);
  },
}));
