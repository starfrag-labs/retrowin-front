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
}

export enum FileIconType {
  Container = FileType.Container,
  Block = FileType.Block,
  Home = SpecialFileName.Home,
  Trash = SpecialFileName.Trash,
  Upload = FileType.Upload,
}
