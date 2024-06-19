import { create } from "zustand";
import { CustomMouseEventType } from "../types/event"

type State = {
  mouseEventType: CustomMouseEventType;
  startMousePosition: { x: number; y: number };
  pressedKey: string[];
}

type Action = {
  setMouseEventType: (eventType: CustomMouseEventType) => void;
  setStartMousePosition: (x: number, y: number) => void;
  setPressedKey: (key: string) => void;
}

const initialState: State = {
  mouseEventType: 'idle',
  startMousePosition: { x: 0, y: 0 },
  pressedKey: [],
}

export const useEventStore = create<State & Action>((set) => ({
  mouseEventType: initialState.mouseEventType,
  pressedKey: initialState.pressedKey,
  startMousePosition: initialState.startMousePosition,
  setMouseEventType: (eventType) => {
    set({ mouseEventType: eventType });
  },
  setStartMousePosition: (x, y) => {
    set({ startMousePosition: { x, y } });
  },
  setPressedKey: (key) => {
    set((state) => {
      if (!state.pressedKey.includes(key)) {
        state.pressedKey = [...state.pressedKey, key];
      }
      return { pressedKey: state.pressedKey };
    });
  },
}))