export interface File {
  fileKey: string;
  fileName: string;
  enabled: boolean;
}

export interface Folder {
  folderKey: string;
  folderName: string;
}

export interface ReadFolderData {
  folders: Folder[];
  files: File[];
}
