import { create } from 'zustand';

type State = {
  elementsRef: Map<string, HTMLElement>;
  backgroundWindowRef: HTMLElement | null;
  windowsRef: Map<string, HTMLElement>;
};

type Action = {
  setElementRef: (key: string, htmlEl: HTMLElement) => void;
  getElementByKey: (key: string) => HTMLElement | undefined;
  setBackgroundWindowRef: (htmlEl: HTMLElement) => void;
  setWindowRef: (key: string, htmlEl: HTMLElement) => void;
  getWindowByKey: (key: string) => HTMLElement | undefined;
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
  setElementRef: (key, htmlEl) => {
    set((state) => {
      if (state.elementsRef) {
        state.elementsRef.set(key, htmlEl);
      }
      console.log(state.elementsRef);

      return { elementsRef: state.elementsRef };
    });
  },
  getElementByKey: (key) => {
    return get().elementsRef.get(key);
  },
  setBackgroundWindowRef: (htmlEl) => {
    set({ backgroundWindowRef: htmlEl });
  },
  setWindowRef: (key, htmlEl) => {
    set((state) => {
      if (state.windowsRef) {
        state.windowsRef.set(key, htmlEl);
      }
      return { windowsRef: state.windowsRef };
    });
  },
  getWindowByKey: (key) => {
    return get().windowsRef.get(key);
  },
}));
