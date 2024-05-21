import { IElement } from './element';

export interface IFile extends IElement {
  enabled: boolean;
}

export interface IFolder extends IElement {}

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
