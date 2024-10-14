import { create } from "zustand";

type State = {
  resizing: boolean;
  renaming: boolean;
  pressedKeys: string[];
}

type Action = {
  setResizing: (resizing: boolean) => void;
  setRenaming: (renaming: boolean) => void;
  keyup: (pressedKey: string) => void;
  keydown: (pressedKey: string) => void;
}

const initialState: State = {
  resizing: false,
  renaming: false,
  pressedKeys: []
}

export const useEventStore = create<State & Action>((set) => ({
  resizing: initialState.resizing,
  renaming: initialState.renaming,
  pressedKeys: initialState.pressedKeys,

  setResizing: (resizing) => set({ resizing }),
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
