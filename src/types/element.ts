export interface IElement {
  name: string;
  key: string;
  type: 'folder' | 'file' | 'uploadFile';
  parentKey: string;
  selected: boolean;
  enabled?: boolean;
}

