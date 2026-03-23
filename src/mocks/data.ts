import type { FileType } from "@/interfaces/file";

// Mock file data structure
export interface MockFile {
  fileKey: string;
  fileName: string;
  type: FileType;
  createDate: string;
  updateDate: string;
  byteSize: number;
  parentKey: string | null;
}

// Generate mock files
const createMockFile = (
  fileName: string,
  type: FileType,
  parentKey: string | null,
  byteSize = 0
): MockFile => ({
  fileKey: `mock-${fileName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`,
  fileName,
  type,
  createDate: new Date().toISOString(),
  updateDate: new Date().toISOString(),
  byteSize,
  parentKey,
});

// Root keys
export const ROOT_KEY = "mock-root-key";
export const HOME_KEY = "mock-home-key";
export const TRASH_KEY = "mock-trash-key";

// Initial mock file system
export const mockFiles: Map<string, MockFile> = new Map();

// Initialize mock file system
const initMockFiles = () => {
  // Root container
  mockFiles.set(ROOT_KEY, {
    fileKey: ROOT_KEY,
    fileName: "root",
    type: "container" as FileType,
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    byteSize: 0,
    parentKey: null,
  });

  // Home container
  mockFiles.set(HOME_KEY, {
    fileKey: HOME_KEY,
    fileName: "home",
    type: "container" as FileType,
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    byteSize: 0,
    parentKey: ROOT_KEY,
  });

  // Trash container
  mockFiles.set(TRASH_KEY, {
    fileKey: TRASH_KEY,
    fileName: "trash",
    type: "container" as FileType,
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    byteSize: 0,
    parentKey: ROOT_KEY,
  });

  // Sample folders in home
  const documentsKey = "mock-documents-key";
  mockFiles.set(documentsKey, {
    fileKey: documentsKey,
    fileName: "Documents",
    type: "container" as FileType,
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    byteSize: 0,
    parentKey: HOME_KEY,
  });

  const picturesKey = "mock-pictures-key";
  mockFiles.set(picturesKey, {
    fileKey: picturesKey,
    fileName: "Pictures",
    type: "container" as FileType,
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    byteSize: 0,
    parentKey: HOME_KEY,
  });

  const musicKey = "mock-music-key";
  mockFiles.set(musicKey, {
    fileKey: musicKey,
    fileName: "Music",
    type: "container" as FileType,
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    byteSize: 0,
    parentKey: HOME_KEY,
  });

  // Sample files
  const readmeKey = "mock-readme-key";
  mockFiles.set(readmeKey, {
    fileKey: readmeKey,
    fileName: "README.md",
    type: "block" as FileType,
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    byteSize: 1024,
    parentKey: HOME_KEY,
  });

  const imageKey = "mock-image-key";
  mockFiles.set(imageKey, {
    fileKey: imageKey,
    fileName: "sample-image.png",
    type: "block" as FileType,
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    byteSize: 2048576,
    parentKey: picturesKey,
  });

  const videoKey = "mock-video-key";
  mockFiles.set(videoKey, {
    fileKey: videoKey,
    fileName: "sample-video.mp4",
    type: "block" as FileType,
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    byteSize: 10485760,
    parentKey: HOME_KEY,
  });

  const audioKey = "mock-audio-key";
  mockFiles.set(audioKey, {
    fileKey: audioKey,
    fileName: "sample-audio.mp3",
    type: "block" as FileType,
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    byteSize: 5242880,
    parentKey: musicKey,
  });
};

initMockFiles();

// Helper functions
export const getChildren = (parentKey: string) => {
  return Array.from(mockFiles.values()).filter(
    (file) => file.parentKey === parentKey
  );
};

export const getFile = (fileKey: string) => {
  return mockFiles.get(fileKey);
};

export const createFile = (
  parentKey: string,
  fileName: string,
  type: FileType
) => {
  const newFile = createMockFile(fileName, type, parentKey);
  mockFiles.set(newFile.fileKey, newFile);
  return newFile;
};

export const deleteFile = (fileKey: string) => {
  const file = mockFiles.get(fileKey);
  if (file) {
    mockFiles.delete(fileKey);
    return file;
  }
  return null;
};

export const updateFileName = (fileKey: string, newName: string) => {
  const file = mockFiles.get(fileKey);
  if (file) {
    file.fileName = newName;
    file.updateDate = new Date().toISOString();
    return file;
  }
  return null;
};

export const updateFileParent = (fileKey: string, newParentKey: string) => {
  const file = mockFiles.get(fileKey);
  if (file) {
    file.parentKey = newParentKey;
    file.updateDate = new Date().toISOString();
    return file;
  }
  return null;
};

export const moveToTrash = (fileKey: string) => {
  const file = mockFiles.get(fileKey);
  if (file) {
    file.parentKey = TRASH_KEY;
    file.updateDate = new Date().toISOString();
    return file;
  }
  return null;
};
