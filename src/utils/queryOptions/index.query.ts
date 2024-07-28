export const retryCount = 3;

export const generateQueryKey = (
  type: 'file' | 'folder' | 'favorite',
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
