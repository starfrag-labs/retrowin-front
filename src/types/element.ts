export type ElementType = 'folder' | 'file';

export interface Element {
  name: string;
  key: string;
  type: ElementType;
  enabled?: boolean;
  parentKey?: string;
}