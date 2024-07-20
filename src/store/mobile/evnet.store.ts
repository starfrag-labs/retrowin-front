import { create } from "zustand";

type State = {
  selecting: boolean;
}

type Action = {
  setSelecting: (selecting: boolean) => void;
}

const initialState: State = {
  selecting: false,
}

export const useEventStore = create<State & Action>((set) => ({
  selecting: initialState.selecting,
  setSelecting: (selecting) => set({ selecting }),
}))