import { FileType } from "./file";

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

export type ApiFileType = FileType.Block | FileType.Container | FileType.Link;

export interface CustomStorageResponse<T = unknown> {
  message: string;
  data: T;
}
