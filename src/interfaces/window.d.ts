export interface IWindow {
  key: string;
  targetKey: string;
  type:
    | 'navigator'
    | 'image'
    | 'video'
    | 'audio'
    | 'document'
    | 'uploader'
    | 'other';
  targetHistory?: string[];
  historyIndex?: number;
}
