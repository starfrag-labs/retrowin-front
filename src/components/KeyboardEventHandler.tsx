import { useCallback, useEffect } from 'react';
import { useEventStore } from '../store/event.store';
import { useElementStore } from '../store/element.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateQueryKey } from '../utils/queryOptions/index.query';
import { deleteFileMutationOption } from '../utils/queryOptions/file.query';
import { deleteFolderMutationOption } from '../utils/queryOptions/folder.query';

export const KeyboardEventHandler = (): React.ReactNode => {
  const queryClient = useQueryClient();

  // Mutations
  const deleteFile = useMutation(deleteFileMutationOption);
  const deleteFolder = useMutation(deleteFolderMutationOption);

  // Store states
  const { selectedKeys, getElementInfo, unselectAllKeys } = useElementStore.getState();
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
          deleteFolder.mutateAsync(key).finally(() => {
            queryClient.invalidateQueries({
              queryKey: generateQueryKey('folder', info.parentKey),
            });
          });
        } else if (info && info.type === 'file') {
          deleteFile.mutateAsync(key).finally(() => {
            queryClient.invalidateQueries({
              queryKey: generateQueryKey('folder', info.parentKey),
            });
            queryClient.invalidateQueries({
              queryKey: generateQueryKey('file', info.key),
            });
          });
        }
      });
      unselectAllKeys();  
    }
  }, [deleteFile, deleteFolder, getElementInfo, queryClient, selectedKeys, unselectAllKeys]);

  useEffect(() => {
    if (pressedKeys.includes('Delete')) {
      deleteSelectedElements();
    }
  }, [deleteSelectedElements, pressedKeys, selectedKeys]);

  return null;
};
