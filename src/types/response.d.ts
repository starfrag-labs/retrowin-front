interface IElementResponse {
  name: string;
  key: string;
  parentKey: string;
  enabled?: boolean;
}

export interface IFile extends IElementResponse {
  enabled: boolean;
}

export interface IFolder extends IElementResponse {}

export interface ReadFolderData {
  folders: IFolder[];
  files: IFile[];
}

export type ProviderType = 'local' | 'google';

export interface IProfile {
  uuidKey: string;
  email: string;
  nickname: string;
  imageUrl: string | null;
  joinDate: string;
  updateDate: string;
  provider: ProviderType;
}
