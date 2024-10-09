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

export type file_type = "block" | "container" | "link";
