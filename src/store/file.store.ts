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
};

export type Action = {
  selectFile: (fileKey: string, windowKey: string) => void;
  unselectFile: (fileKey: string, windowKey: string) => void;
  unselectAllFiles: () => void;
  isFileKeySelected: (fileKey: string) => boolean;
  setHighlightedFile: (highlightedFile: State["highlightedFile"]) => void;
  setFileRef: (
    fileKey: string,
    windowKey: string,
    ref: React.RefObject<HTMLElement>,
  ) => void;
};

const initialState: State = {
  selectedFileSerials: [],
  highlightedFile: null,
  fileRefs: new Map(),
};

export const useFileStore = create<State & Action>((set) => ({
  selectedFileSerials: initialState.selectedFileSerials,
  highlightedFile: initialState.highlightedFile,
  fileRefs: initialState.fileRefs,
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
    return initialState.selectedFileSerials.some((key) =>
      key.startsWith(fileKey),
    );
  },
  setHighlightedFile: (highlightedFile) => {
    set({ highlightedFile });
  },
  setFileRef: (fileKey, windowKey, ref) => {
    const serialKey = `${fileKey}:${windowKey}`;
    set((state) => {
      state.fileRefs.set(serialKey, ref);
      return { fileRefs: state.fileRefs };
    });
  },
}));
