export enum WindowType {
  Navigator = 'navigator',
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  Document = 'document',
  Uploader = 'uploader',
  Other = 'other',
}
export interface AppWindow {
  key: string;
  title: string; 
  targetKey: string;
  type: WindowType;
  targetHistory?: string[];
  historyIndex?: number;
}
