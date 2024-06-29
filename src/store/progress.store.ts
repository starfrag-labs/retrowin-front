import { create } from 'zustand';
import { IProgressState } from './../types/store.d';

type State = {
  progresses: IProgressState[];
};

type Action = {
  addProgress: ({
    key,
    name,
    type,
  }: {
    key: string;
    name: string;
    type: IProgressState['type'];
  }) => void;
  findProgress: (key: string) => IProgressState | undefined;
  updateProgress: ({
    key,
    loaded,
    total,
  }: {
    key: string;
    loaded: number;
    total: number;
  }) => void;
  removeProgress: (key: string) => void;
};

const initialState: State = {
  progresses: [],
};

export const useProgressStore = create<State & Action>((set, get) => ({
  progresses: initialState.progresses,
  addProgress: ({ key, name, type }) =>
    set((state) => ({
      progresses: [
        ...state.progresses,
        {
          key,
          name,
          type,
          loaded: 0,
          total: 1,
        },
      ],
    })),
  findProgress: (key) => get().progresses.find((p) => p.key === key),
  updateProgress: ({ key, loaded, total }) =>
    set((state) => ({
      progresses: state.progresses.map((p) =>
        p.key === key ? { ...p, loaded, total } : p
      ),
    })),
  removeProgress: (key) =>
    set((state) => ({
      progresses: state.progresses.filter((p) => p.key !== key),
    })),
}));
