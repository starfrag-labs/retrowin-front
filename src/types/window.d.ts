export interface IWindow {
  key: string;
  name: string;
  type: 'folder' | 'image' | 'video' | 'audio' | 'document' | 'other';
  minimized: boolean;
  zIndex: number;
}