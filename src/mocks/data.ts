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
  path: string;
}

// Root keys
export const ROOT_KEY = "mock-root-key";
export const HOME_KEY = "mock-home-key";
export const TRASH_KEY = "mock-trash-key";

// Path to fileKey mapping
const pathToKeyMap = new Map<string, string>();

// Generate mock files
const createMockFile = (
  fileName: string,
  type: FileType,
  parentKey: string | null,
  byteSize = 0,
  path: string,
  overrideFileKey?: string  // Allow overriding the generated fileKey
): MockFile => ({
  fileKey: overrideFileKey || `mock-${fileName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  fileName,
  type,
  createDate: new Date().toISOString(),
  updateDate: new Date().toISOString(),
  byteSize,
  parentKey,
  path,
});

// Initial mock file system
export const mockFiles: Map<string, MockFile> = new Map();

// Initialize mock file system
const initMockFiles = () => {
  pathToKeyMap.clear();

  // Root container - use ROOT_KEY as fileKey
  const root = createMockFile("root", "container" as FileType, null, 0, "/", ROOT_KEY);
  mockFiles.set(ROOT_KEY, root);
  pathToKeyMap.set("/", ROOT_KEY);

  // Home container - use HOME_KEY as fileKey
  const home = createMockFile("home", "container" as FileType, ROOT_KEY, 0, "/home", HOME_KEY);
  mockFiles.set(HOME_KEY, home);
  pathToKeyMap.set("/home", HOME_KEY);

  // Trash container - use TRASH_KEY as fileKey
  const trash = createMockFile("trash", "container" as FileType, ROOT_KEY, 0, "/.trash", TRASH_KEY);
  mockFiles.set(TRASH_KEY, trash);
  pathToKeyMap.set("/.trash", TRASH_KEY);

  // Sample folders in home
  const documents = createMockFile("Documents", "container" as FileType, HOME_KEY, 0, "/home/Documents");
  mockFiles.set(documents.fileKey, documents);
  pathToKeyMap.set("/home/Documents", documents.fileKey);

  const pictures = createMockFile("Pictures", "container" as FileType, HOME_KEY, 0, "/home/Pictures");
  mockFiles.set(pictures.fileKey, pictures);
  pathToKeyMap.set("/home/Pictures", pictures.fileKey);

  const music = createMockFile("Music", "container" as FileType, HOME_KEY, 0, "/home/Music");
  mockFiles.set(music.fileKey, music);
  pathToKeyMap.set("/home/Music", music.fileKey);

  // Sample files
  const readme = createMockFile("README.md", "block" as FileType, HOME_KEY, 1024, "/home/README.md");
  mockFiles.set(readme.fileKey, readme);
  pathToKeyMap.set("/home/README.md", readme.fileKey);

  const image = createMockFile("sample-image.png", "block" as FileType, pictures.fileKey, 2048576, "/home/Pictures/sample-image.png");
  mockFiles.set(image.fileKey, image);
  pathToKeyMap.set("/home/Pictures/sample-image.png", image.fileKey);

  const video = createMockFile("sample-video.mp4", "block" as FileType, HOME_KEY, 10485760, "/home/sample-video.mp4");
  mockFiles.set(video.fileKey, video);
  pathToKeyMap.set("/home/sample-video.mp4", video.fileKey);

  const audio = createMockFile("sample-audio.mp3", "block" as FileType, music.fileKey, 5242880, "/home/Music/sample-audio.mp3");
  mockFiles.set(audio.fileKey, audio);
  pathToKeyMap.set("/home/Music/sample-audio.mp3", audio.fileKey);
};

// Initialize mock file system
initMockFiles();

// Re-initialize on hot reload in development
if (typeof window !== "undefined" && (window as any).$mswRegistry) {
  const originalInit = initMockFiles;
  (window as any).$reinitMockFiles = () => {
    mockFiles.clear();
    pathToKeyMap.clear();
    originalInit();
  };
}

// Helper functions
export const getChildren = (parentKey: string) => {
  return Array.from(mockFiles.values()).filter(
    (file) => file.parentKey === parentKey
  );
};

export const getFile = (fileKey: string) => {
  return mockFiles.get(fileKey);
};

// Get file by path
export const getFileByPath = (path: string) => {
  const fileKey = pathToKeyMap.get(path);
  if (fileKey) {
    return mockFiles.get(fileKey);
  }
  return null;
};

// Get path from fileKey
export const getPathFromFileKey = (fileKey: string) => {
  const file = mockFiles.get(fileKey);
  return file?.path || null;
};

export const createFile = (
  parentKey: string,
  fileName: string,
  type: FileType
) => {
  const parent = mockFiles.get(parentKey);
  if (!parent) return null;

  const newPath = `${parent.path === "/" ? "" : parent.path}/${fileName}`;
  const newFile = createMockFile(fileName, type, parentKey, 0, newPath);
  mockFiles.set(newFile.fileKey, newFile);
  pathToKeyMap.set(newPath, newFile.fileKey);
  return newFile;
};

export const deleteFile = (fileKey: string) => {
  const file = mockFiles.get(fileKey);
  if (file) {
    // Also delete all children
    const children = getChildren(fileKey);
    children.forEach((child) => deleteFile(child.fileKey));

    pathToKeyMap.delete(file.path);
    mockFiles.delete(fileKey);
    return file;
  }
  return null;
};

export const updateFileName = (fileKey: string, newName: string) => {
  const file = mockFiles.get(fileKey);
  if (file) {
    const oldPath = file.path;
    const parentPath = oldPath.substring(0, oldPath.lastIndexOf("/")) || "/";
    const newPath = `${parentPath === "/" ? "" : parentPath}/${newName}`;

    // Remove old path mapping
    pathToKeyMap.delete(oldPath);

    file.fileName = newName;
    file.path = newPath;
    file.updateDate = new Date().toISOString();

    // Add new path mapping
    pathToKeyMap.set(newPath, fileKey);

    return file;
  }
  return null;
};

export const updateFileParent = (fileKey: string, newParentKey: string) => {
  const file = mockFiles.get(fileKey);
  const newParent = mockFiles.get(newParentKey);
  if (file && newParent) {
    const oldPath = file.path;
    const newPath = `${newParent.path === "/" ? "" : newParent.path}/${file.fileName}`;

    // Remove old path mapping
    pathToKeyMap.delete(oldPath);

    file.parentKey = newParentKey;
    file.path = newPath;
    file.updateDate = new Date().toISOString();

    // Add new path mapping
    pathToKeyMap.set(newPath, fileKey);

    return file;
  }
  return null;
};

export const moveToTrash = (fileKey: string) => {
  const file = mockFiles.get(fileKey);
  if (file) {
    const oldPath = file.path;
    const trashName = `trash-${Date.now()}`;
    const newPath = `/.trash/${trashName}`;

    pathToKeyMap.delete(oldPath);

    file.parentKey = TRASH_KEY;
    file.path = newPath;
    file.updateDate = new Date().toISOString();

    pathToKeyMap.set(newPath, fileKey);
    return file;
  }
  return null;
};
