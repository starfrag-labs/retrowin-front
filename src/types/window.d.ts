export interface IWindow {
  key: string;
  type: 'navigator' | 'image' | 'video' | 'audio' | 'document' | 'uploader' | 'other';
  minimized: boolean;
}