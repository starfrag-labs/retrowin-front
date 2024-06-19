import { create } from "zustand";

type State = {
  resizing: boolean;
  renaming: boolean;
}

type Action = {
  setResizing: (resizing: boolean) => void;
  setRenaming: (renaming: boolean) => void;
}

const initialState: State = {
  resizing: false,
  renaming: false,
}

export const useEventStore = create<State & Action>((set) => ({
  resizing: initialState.resizing,
  renaming: initialState.renaming,
  setResizing: (resizing) => set({ resizing }),
  setRenaming: (renaming) => set({ renaming }),
}))