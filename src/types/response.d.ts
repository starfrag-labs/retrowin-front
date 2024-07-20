import { IElement } from "./element";

interface IElementResponse extends IElement {}

export interface IFile extends IElementResponse {
  enabled: boolean;
}

export interface IFolder extends IElementResponse {}

export interface ReadFolderData {
  folders: IFolder[];
  files: IFile[];
}

export interface getFolderInfoData {
  key: string;
  name: string;
  info: {
    createDate: Date;
    updateDate: Date;
  }
  parentKey: string;
}

export type ProviderType = 'local' | 'google';

export interface IProfile {
  email: string;
  imageUrl: string | null;
  nickname: string;
  joinDate: string;
  updateDate: string;
  provider: ProviderType;
}
