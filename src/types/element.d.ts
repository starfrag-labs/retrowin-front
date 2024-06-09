export interface IElement {
  name: string;
  key: string;
  parentKey: string;
  enabled?: boolean;
}

export interface IStoreElement extends IElement {
  type: 'folder' | 'file' | 'upload';
  selected: boolean;
}
