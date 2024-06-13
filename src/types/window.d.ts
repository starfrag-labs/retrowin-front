export interface IWindow {
  key: string;
  type: 'navigator' | 'image' | 'video' | 'audio' | 'document' | 'other';
  minimized: boolean;
}