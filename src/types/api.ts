import type { BackendFileType } from "./file";

export interface CustomFetchResponse<T = unknown> {
  headers: Headers;
  status: number;
  body: T;
}

export interface CustomResponse<T = unknown> {
  message: string;
  data: T;
}

export interface ErrorResponseData {
  name: string;
  path: string;
  timestamp: string;
}

export interface QueryError {
  status: number;
  message: string;
}

export type ApiFileType =
  | BackendFileType.Regular
  | BackendFileType.Object
  | BackendFileType.Directory
  | BackendFileType.Symlink;

export interface CustomStorageResponse<T = unknown> {
  message: string;
  data: T;
}
