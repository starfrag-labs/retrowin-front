import { create } from "zustand";
import { Element } from "../types/element";

type State = {
  elements: Element[];
};

type Action = {
  setElements: (elements: Element[]) => void;
  addElement: (element: Element) => void;
  removeElement: (key: string) => void;
  changeElement: (key: string, element: Element) => void;
  findElement: (key: string, elements: Element[]) => Element | undefined;
};

const initialState: State = {
  elements: [],
};

export const useElementStore = create<State & Action>((set) => ({
  elements: initialState.elements,
  setElements: (elements) => set({ elements }),
  addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
  removeElement: (key) => set((state) => ({ elements: state.elements.filter((element) => element.key !== key) })),
  changeElement: (key, element) => set((state) => ({ elements: state.elements.map((e) => (e.key === key ? element : e)) })),
  findElement: (key, elements) => elements.find((element) => element.key === key),
}));
