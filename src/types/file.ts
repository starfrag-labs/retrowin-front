// Backend dirent d_type constants (aligned with Go backend inode modes)
export const DT_DIR = 4; // 0x4000 Directory
export const DT_REG = 8; // 0x8000 Regular file
export const DT_LNK = 10; // 0xA000 Symbolic link
export const DT_OBJ = 3; // 0x3000 External storage object (S3, etc.)

// Backend-aligned file types (directly from API response)
export enum BackendFileType {
  Directory = "directory",
  Regular = "regular",
  Symlink = "symlink",
  Object = "object",
}

// UI-only virtual file types (not from API, derived from path/name)
export enum VirtualFileType {
  Root = "root",
  Home = "home",
  Trash = "trash",
  Upload = "upload",
}

// Combined type used throughout the UI
export type FileType = BackendFileType | VirtualFileType;

// Icon types for visual representation
export enum FileIconType {
  Directory = "directory",
  Regular = "regular",
  Object = "object",
  Home = "home",
  Trash = "trash",
  Upload = "upload",
  Image = "image",
  Video = "video",
  Audio = "audio",
}

export enum SpecialFileName {
  Root = "root",
  Home = "home",
  Trash = "trash",
  Upload = "upload",
}
