export enum SpecialFileName {
  Root = "root",
  Home = "home",
  Trash = "trash",
  Upload = "upload",
}
export enum FileType {
  Container = "container",
  Regular = "regular", // Regular file (no functionality)
  Link = "link",
  Object = "object", // External storage object (S3, etc.) - supports media playback and download
  Upload = "upload",
  Root = "root",
  Trash = "trash",
  Home = "home",
}

export enum FileIconType {
  Container = "container",
  Regular = "regular",
  Object = "object",
  Home = "home",
  Trash = "trash",
  Upload = "upload",
  Image = "image",
  Video = "video",
  Audio = "audio",
}
