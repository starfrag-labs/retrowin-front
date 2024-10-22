export interface CustomFetchResponse<T = unknown> {
  headers: Headers;
  status: number;
  body: T;
}

export interface CustomResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}

export interface ErrorResponseData {
  name: string;
  path: string;
  timestamp: string;
}

export enum ApiFileType {
  Block = "block",
  Container = "container",
  Link = "link",
}

export interface CustomStorageResponse<T = unknown> {
  message: string;
  data: T;
}
