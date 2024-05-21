import { create } from 'zustand';
import { IElement } from '../types/element';

export interface StoreElement extends IElement {
  type: 'folder' | 'file';
  parentKey: string;
  enabled?: boolean;
}

type State = {
  elements: Map<string, StoreElement>;
};

type Action = {
  setElements: (elements: StoreElement[]) => void;
  setElement: (element: StoreElement) => void;
  removeElement: (key: string) => void;
  findElement: (
    key: string,
    elements: StoreElement[]
  ) => StoreElement | undefined;
  renameElement: (key: string, newName: string) => void;
};

const initialState: State = {
  elements: new Map<string, StoreElement>(),
};

export const useElementStore = create<State & Action>((set) => ({
  elements: initialState.elements,
  setElements: (elements) => {
    set((state) => {
      elements.forEach((element) => {
        state.elements.set(element.key, element);
      });
      return { elements: state.elements };
    });
  },
  setElement: (element) => {
    set((state) => {
      state.elements.set(element.key, element);
      return { elements: state.elements };
    });
  },
  removeElement: (key) => {
    set((state) => {
      state.elements.delete(key);
      return { elements: state.elements };
    });
  },
  findElement: (key, elements) => {
    return elements.find((element) => element.key === key);
  },
  renameElement: (key, newName) => {
    set((state) => {
      const element = state.elements.get(key);
      if (element) {
        element.name = newName;
        state.elements.set(key, element);
      }
      return { elements: state.elements };
    });
  }
}));
