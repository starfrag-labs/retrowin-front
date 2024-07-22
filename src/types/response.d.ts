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
  parentKey: string;
  info: {
    createDate: Date;
    updateDate: Date;
  }
}

export interface getFileInfoData {
  fileKey: string;
  fileName: string;
  enabled: boolean;
  parentFolderKey: string;
  info: {
    byteSize: number;
    createDate: Date;
    updateDate: Date;
  };
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
