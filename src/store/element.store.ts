import { create } from 'zustand';
import { IStoreElement } from '../types/element';

type State = {
  elements: Map<string, IStoreElement>;
};

type Action = {
  getElements: () => Map<string, IStoreElement>;
  getElementsByParentKey: (parentKey: string) => IStoreElement[];
  setElements: (elements: IStoreElement[]) => void;
  setElement: (element: IStoreElement) => void;
  removeElement: (key: string) => void;
  findElement: (
    key: string,
    elements: IStoreElement[]
  ) => IStoreElement | undefined;
  renameElement: (key: string, newName: string) => void;
  selectElement: (key: string) => void;
  unselectElement: (key: string) => void;
  getAbsolutePath: (key: string) => string;
};

const initialState: State = {
  elements: new Map<string, IStoreElement>(),
};

export const useElementStore = create<State & Action>((set, get) => ({
  elements: initialState.elements,
  // Element functions
  getElementsByParentKey: (parentKey) => {
    return Array.from(get().elements.values()).filter(
      (element) => element.parentKey === parentKey
    );
  },
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
  getAbsolutePath: (key) => {
    const element = get().elements.get(key);
    let path = '';
    let currentElement: IStoreElement | undefined = element;
    while (currentElement && currentElement.parentKey !== '') {
      path = `${currentElement.name}/${path}`;
      currentElement = get().elements.get(currentElement.parentKey);
    }
    path = path.slice(0, -1);
    path = `/${path}`;
    return path;
  },
}));
