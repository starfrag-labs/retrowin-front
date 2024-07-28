import { useCallback, useEffect } from 'react';
import { useEventStore } from '../store/event.store';
import { useElementStore } from '../store/element.store';
import { deleteFile, deleteFolder } from '../api/cloud';
import { useQueryClient } from '@tanstack/react-query';
import { generateQueryKey } from '../utils/queryOptions/index.query';

export const KeyboardEventHandler = (): React.ReactNode => {
  const queryClient = useQueryClient();

  const { selectedKeys, getElementInfo } = useElementStore.getState();
  const pressedKeys = useEventStore((state) => state.pressedKeys);
  const { keyup, keydown } = useEventStore.getState();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keydown(e.key);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keyup(e.key);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [keydown, keyup]);

  const deleteSelectedElements = useCallback(() => {
    if (selectedKeys.length > 0) {
      selectedKeys.forEach((key) => {
        const info = getElementInfo(key);
        if (info && info.type === 'folder') {
          deleteFolder(key).finally(() => {
            queryClient.invalidateQueries({
              queryKey: generateQueryKey('folder', info.parentKey),
            });
          });
        } else if (info && info.type === 'file') {
          deleteFile(key).finally(() => {
            queryClient.invalidateQueries({
              queryKey: generateQueryKey('folder', info.parentKey),
            });
            queryClient.invalidateQueries({
              queryKey: generateQueryKey('file', info.key),
            });
          });
        }
      });
    }
  }, [getElementInfo, queryClient, selectedKeys]);

  useEffect(() => {
    if (pressedKeys.includes('Delete')) {
      deleteSelectedElements();
    }
  }, [deleteSelectedElements, pressedKeys, selectedKeys]);

  return null;
};
