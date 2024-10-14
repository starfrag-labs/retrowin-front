import { create } from "zustand";

export type FileInfo = {
  key: string;
  type: "block" | "container" | "upload";
  name: string;
  parentKey: string;
};

export type State = {
  selectedFileSerials: string[];
  highlightedFile: {
    fileKey: string;
    windowKey: string;
    ref: React.RefObject<HTMLElement>;
  } | null;
  fileRefs: Map<string, React.RefObject<HTMLElement>>;
  fileIconRefs: Map<string, React.RefObject<HTMLElement>>;
};

export type Action = {
  selectFile: (fileKey: string, windowKey: string) => void;
  unselectFile: (fileKey: string, windowKey: string) => void;
  unselectAllFiles: () => void;
  isFileKeySelected: (fileKey: string) => boolean;
  setHighlightedFile: (highlightedFile: State["highlightedFile"]) => void;
  setFileIconRef: (
    fileKey: string,
    windowKey: string,
    ref: React.RefObject<HTMLElement>,
  ) => void;
};

const initialState: State = {
  selectedFileSerials: [],
  highlightedFile: null,
  fileRefs: new Map(),
  fileIconRefs: new Map(),
};

export const useFileStore = create<State & Action>((set, get) => ({
  selectedFileSerials: initialState.selectedFileSerials,
  highlightedFile: initialState.highlightedFile,
  fileRefs: initialState.fileRefs,
  fileIconRefs: initialState.fileIconRefs,
  selectFile: (fileKey, windowKey) => {
    set((state) => {
      const serialKey = `${fileKey}:${windowKey}`;
      if (!state.selectedFileSerials.includes(serialKey)) {
        state.selectedFileSerials = [...state.selectedFileSerials, serialKey];
      }
      return { selectedFileSerials: state.selectedFileSerials };
    });
  },
  unselectFile: (fileKey, windowKey) => {
    const serialKey = `${fileKey}:${windowKey}`;
    set((state) => {
      state.selectedFileSerials = state.selectedFileSerials.filter(
        (k) => k !== serialKey,
      );
      return { selectedFileSerials: state.selectedFileSerials };
    });
  },
  unselectAllFiles: () => {
    set({ selectedFileSerials: [] });
  },
  isFileKeySelected: (fileKey) => {
    return get().selectedFileSerials.some((key) => key.startsWith(fileKey));
  },
  setHighlightedFile: (highlightedFile) => {
    set({ highlightedFile });
  },
  setFileIconRef: (fileKey, windowKey, ref) => {
    const serialKey = `${fileKey}:${windowKey}`;
    set((state) => {
      state.fileIconRefs.set(serialKey, ref);
      return { fileIconRefs: state.fileIconRefs };
    });
  },
}));
