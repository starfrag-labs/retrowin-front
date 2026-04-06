import {
  BackendFileType,
  FileIconType,
  type FileType,
  VirtualFileType,
} from "@/config/file_type_config";

export type { FileType };
export { BackendFileType, FileIconType, VirtualFileType };

export enum SpecialFileName {
  Root = "root",
  Home = "home",
  Trash = "trash",
  Upload = "upload",
}
