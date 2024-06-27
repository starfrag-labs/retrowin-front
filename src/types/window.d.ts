export interface IWindow {
  key: string;
  type:
    | 'navigator'
    | 'image'
    | 'video'
    | 'audio'
    | 'document'
    | 'uploader'
    | 'other';
  minimized: boolean;
}

export interface IWindowV2 {
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
}
