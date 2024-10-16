import { create } from "zustand";

type State = {
  resizingCursor: boolean;
  renaming: boolean;
  pressedKeys: string[];
}

type Action = {
  setResizingCursor: (resizing: boolean) => void;
  setRenaming: (renaming: boolean) => void;
  keyup: (pressedKey: string) => void;
  keydown: (pressedKey: string) => void;
}

const initialState: State = {
  resizingCursor: false,
  renaming: false,
  pressedKeys: []
}

export const useEventStore = create<State & Action>((set) => ({
  resizingCursor: initialState.resizingCursor,
  renaming: initialState.renaming,
  pressedKeys: initialState.pressedKeys,

  setResizingCursor: (resizing) => set({ resizingCursor: resizing }),
  setRenaming: (renaming) => set({ renaming }),
  keyup: (pressedKey) => {
    set((state) => {
      state.pressedKeys = state.pressedKeys.filter((key) => key !== pressedKey)
      return { pressedKeys: state.pressedKeys }
    })
  },
  keydown: (pressedKey) => {
    set((state) => {
      if (!state.pressedKeys.includes(pressedKey)) {
        state.pressedKeys = [...state.pressedKeys, pressedKey]
      }
      return { pressedKeys: state.pressedKeys }
    })
  }
}))
