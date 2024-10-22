import { ApiFileType } from "./api";

export type FileType = ApiFileType | "upload";

export enum FileIconType {
  Container = "container",
  Block = "block",
  Home = "home",
  Trash = "trash",
  Upload = "upload",
}
