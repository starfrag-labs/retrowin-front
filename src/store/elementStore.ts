import { create } from 'zustand';
import { IElement } from '../types/element';

type State = {
  elements: Map<string, IElement>;
};

type Action = {
  getElements: () => Map<string, IElement>;
  setElements: (elements: IElement[]) => void;
  setElement: (element: IElement) => void;
  removeElement: (key: string) => void;
  findElement: (
    key: string,
    elements: IElement[]
  ) => IElement | undefined;
  renameElement: (key: string, newName: string) => void;
  selectElement: (key: string) => void;
  unselectElement: (key: string) => void;
};

const initialState: State = {
  elements: new Map<string, IElement>(),
};

export const useElementStore = create<State & Action>((set, get) => ({
  elements: initialState.elements,
  getElements: () => get().elements,
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
  },
  selectElement: (key) => {
    set((state) => {
      const element = state.elements.get(key);
      if (element) {
        element.selected = true;
        state.elements.set(key, element);
      }
      return { elements: state.elements };
    });
  },
  unselectElement: (key) => {
    set((state) => {
      const element = state.elements.get(key);
      if (element) {
        element.selected = false;
        state.elements.set(key, element);
      }
      return { elements: state.elements };
    });
  },
}));
