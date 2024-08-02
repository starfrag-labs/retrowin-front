export const retryCount = 3;
export const strongRetryCount = 5;

export const generateQueryKey = (
  type: 'file' | 'folder' | 'user',
  key?: string,
  method?: 'read' | 'info' | 'path'
) => {
  if (key && method) {
    return [type, key, method];
  } else if (key) {
    return [type, key];
  } else {
    return [type];
  }
};
