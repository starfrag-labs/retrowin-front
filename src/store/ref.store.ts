import React from "react";
import { create } from "zustand";

type State = {
  elementsRef: React.RefObject<Map<string, HTMLElement>>,
  windowsRef: React.RefObject<Map<string, HTMLElement>>,
}

type Action = {
  setElementRef: (key: string, htmlEl: HTMLElement) => void;
  setElementsRef: (
    elementsRef: React.RefObject<Map<string, HTMLElement>>
  ) => void;
  getElementByKey: (key: string) => HTMLElement | undefined;
  setWindowRef: (
    key: string,
    htmlEl: HTMLElement
  ) => void;
  setWindowsRef: (
    windowsRef: React.RefObject<Map<string, HTMLElement>>
  ) => void;
  getWindowByKey: (key: string) => HTMLElement | undefined;
};

const initialState: State = {
  elementsRef: React.createRef<Map<string, HTMLElement>>(),
  windowsRef: React.createRef<Map<string, HTMLElement>>(),
};

export const useRefStore = create<State & Action>((set, get) => ({
  elementsRef: initialState.elementsRef,
  windowsRef: initialState.windowsRef,
  setElementRef: (key, htmlEl) => {
    set((state) => {
      if (state.elementsRef.current) {
        state.elementsRef.current.set(key, htmlEl);
      }
      return { elementsRef: state.elementsRef };
    });
  },
  setElementsRef: (elementsRef) => {
    set((state) => {
      if (state.elementsRef.current === null) {
        state.elementsRef = elementsRef;
      } else {
        elementsRef.current?.forEach((el, key) => {
          state.elementsRef.current?.set(key, el);
        });
      }
      return { elementsRef: state.elementsRef };
    });
  },
  getElementByKey: (key) => {
    return get().elementsRef.current?.get(key);
  },
  setWindowRef: (key, htmlEl) => {
    set((state) => {
      if (state.windowsRef.current) {
        state.windowsRef.current.set(key, htmlEl);
      }
      return { windowsRef: state.windowsRef };
    });
  },
  setWindowsRef: (windowsRef) => {
    set((state) => {
      if (state.windowsRef.current === null) {
        state.windowsRef = windowsRef;
      } else {
        windowsRef.current?.forEach((el, key) => {
          state.windowsRef.current?.set(key, el);
        });
      }
      return { windowsRef: state.windowsRef };
    });
  },
  getWindowByKey: (key) => {
    return get().windowsRef.current?.get(key);
  },
}));