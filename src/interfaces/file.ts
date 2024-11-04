export enum SpecialFileName {
  Root = "root",
  Home = "home",
  Trash = "trash",
  Upload = "upload",
}
export enum FileType {
  Container = "container",
  Block = "block",
  Link = "link",
  Upload = "upload",
  Root = "root",
  Trash = "trash",
  Home = "home",
}

export enum FileIconType {
  Container = FileType.Container,
  Block = FileType.Block,
  Home = SpecialFileName.Home,
  Trash = SpecialFileName.Trash,
  Upload = FileType.Upload,
  Image = "image",
  Video = "video",
  Audio = "audio",
}
