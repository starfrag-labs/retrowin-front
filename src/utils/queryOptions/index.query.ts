export const retryCount = 3;

export const generateQueryKey = (
  type: 'file' | 'folder',
  key: string,
  method?: 'read' | 'info' | 'path'
) => {
  if (method) {
    return [type, key, method];
  }
  return [type, key];
};

