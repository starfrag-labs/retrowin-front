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

export type Provider = 'local' | 'google';

export interface Profile {
  uuidKey: string;
  email: string;
  nickname: string;
  imageUrl: string | null;
  joinDate: string;
  updateDate: string;
  provider: Provider;
}