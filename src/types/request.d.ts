export interface Methods {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

export interface Urls {
  [key: string]: Methods;
}
