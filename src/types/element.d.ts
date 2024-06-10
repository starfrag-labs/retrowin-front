export interface IStoreElement {
  name: string;
  elementKey: string;
  parentKey: string;
  enabled?: boolean;
  type: 'folder' | 'file' | 'upload';
  selected: boolean;
}
