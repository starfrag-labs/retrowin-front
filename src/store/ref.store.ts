import React from "react";
import { create } from "zustand";

type State = {
  elementsRef: React.RefObject<Map<string, HTMLElement>>,
}

type Action = {
  setHtmlElement: (key: string, htmlEl: HTMLElement) => void;
  setElementsRef: (elementsRef: React.RefObject<Map<string, HTMLElement>>) => void;
  getElementByKey: (key: string) => HTMLElement | undefined;
}

const initialState: State = {
  elementsRef: React.createRef<Map<string, HTMLElement>>(),
}

export const useRefStore = create<State & Action>((set, get) => ({
  elementsRef: initialState.elementsRef,
  setHtmlElement: (key, htmlEl) => {
    set((state) => {
      if (state.elementsRef.current) {
        state.elementsRef.current.set(key, htmlEl);
      }
      return { elementsRef: state.elementsRef };
    });
  },
  setElementsRef: (elementsRef) => {
    set((state) => {
      elementsRef.current?.forEach((value, key) => {
        state.elementsRef.current?.set(key, value);
      });
      return { elementsRef: state.elementsRef };
    });
  },
  getElementByKey: (key) => {
    return get().elementsRef.current?.get(key);
  },
}));