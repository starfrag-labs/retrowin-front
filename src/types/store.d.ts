import { IElement } from "./element";
import { IProfile } from "./response";
import { IWindow } from "./window";

export interface IElementState extends IElement {
  type: 'folder' | 'file' | 'upload';
  selected: boolean;
  renaming: boolean;
  htmlElement?: HTMLElement;
}

export interface IWindowState extends IWindow {
  minimized: boolean;
}

export interface IProfileState extends IProfile {
  isCloudUser: boolean;
}