import { create } from "zustand";
import { IMobileElementState } from "../../types/store"

type State = {
  elements: IMobileElementState[];
  activeElementKey: string;
}

type Action = {
  setActiveElementKey: (key: string) => void;
  addElement: (element: IMobileElementState) => void;
  addElements: (elements: IMobileElementState[]) => void;
  deleteElement: (key: string) => void;
  findElement: (key: string) => IMobileElementState | undefined;
  findElementsByParentKey: (parentKey: string) => IMobileElementState[];
  selectElement: (key: string) => void;
  unselectElement: (key: string) => void;
  unselectAllElements: () => void;
  moveElement: (key: string, parentKey: string) => void;
  renameElement: (key: string, name: string) => void;
}

const initialState: State = {
  elements: [],
  activeElementKey: '',
}

export const useMobileElementStore = create<State & Action>((set, get) => ({
  elements: initialState.elements,
  activeElementKey: initialState.activeElementKey,
  setActiveElementKey: (key) => {
    set({ activeElementKey: key });
  },
  addElement: (element) => {
    set((state) => {
      const filteredElements = state.elements.filter(
        (stateElement) => stateElement.key !== element.key
      );
      state.elements = [...filteredElements, element];
      return { elements: state.elements };
    });
  },
  addElements: (elements) => {
    set((state) => {
      const filteredElements = state.elements.filter(
        (stateElement) => !elements.some((el) => el.key === stateElement.key)
      );
      state.elements = [...filteredElements, ...elements];
      return { elements: state.elements };
    });
  },
  deleteElement: (key) => {
    set((state) => {
      state.elements = state.elements.filter((element) => element.key !== key);
      return { elements: state.elements };
    });
  },
  findElement: (key) => {
    return get().elements.find((element) => element.key === key);
  },
  findElementsByParentKey: (parentKey) => {
    return get().elements.filter((element) => element.parentKey === parentKey);
  },
  selectElement: (key) => {
    set((state) => {
      state.elements = state.elements.map((element) => {
        if (element.key === key) {
          element.selected = true;
        }
        return element;
      });
      return { elements: state.elements };
    });
  },
  unselectElement: (key) => {
    set((state) => {
      state.elements = state.elements.map((element) => {
        if (element.key === key) {
          element.selected = false;
        }
        return element;
      });
      return { elements: state.elements };
    });
  },
  unselectAllElements: () => {
    set((state) => {
      state.elements = state.elements.map((element) => {
        element.selected = false;
        return element;
      });
      return { elements: state.elements };
    });
  },
  moveElement: (key, parentKey) => {
    set((state) => {
      state.elements = state.elements.map((element) => {
        if (element.key === key) {
          element.parentKey = parentKey;
        }
        return element;
      });
      return { elements: state.elements };
    });
  },
  renameElement: (key, name) => {
    set((state) => {
      state.elements = state.elements.map((element) => {
        if (element.key === key) {
          element.name = name;
        }
        return element;
      });
      return { elements: state.elements };
    });
  }
}));