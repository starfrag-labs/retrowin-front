import { queryOptions, UseMutationOptions } from '@tanstack/react-query';
import {
  deleteFile,
  downloadFile,
  getFileInfo,
  moveFile,
  renameFile,
  uploadChunk,
} from '../../api/cloud';
import { generateQueryKey, retryCount, strongRetryCount } from './index.query';
import { useProgressStore } from '../../store/progress.store';

export const downloadFileQueryOption = (
  fileKey: string,
  progressName?: string
) =>
  queryOptions<Blob>({
    retry: strongRetryCount,
    queryKey: generateQueryKey('file', fileKey, 'read'),
    queryFn: async ({ signal }) => {
      const data = await downloadFile(fileKey, progressName, signal).then(
        (response) => {
          return response.data;
        }
      );
      return data;
    },
    enabled: !!fileKey,
  });

export const getFileInfoQueryOption = (fileKey: string) =>
  queryOptions({
    retry: retryCount,
    queryKey: generateQueryKey('file', fileKey, 'info'),
    queryFn: async () => {
      const data = await getFileInfo(fileKey).then((response) => {
        return response.data;
      });
      return data;
    },
    enabled: !!fileKey,
  });

export const uploadFileMutationOption: UseMutationOptions<
  void,
  Error,
  { file: File; folderKey: string }
> = {
  retry: strongRetryCount,
  onMutate: async ({ file, folderKey }: { file: File; folderKey: string }) => {
    const { addProgress, updateProgress, findProgress } =
      useProgressStore.getState();
    const fileName = file.name.replace(/\s/g, '_');

    // check if progress exists
    if (!findProgress(`${folderKey}-${fileName}`)) {
      // add progress
      addProgress({
        key: `${folderKey}-${fileName}`,
        name: `${fileName}`,
        type: 'upload',
      });
      updateProgress({
        key: `${folderKey}-${fileName}`,
        loaded: 0,
        total: file.size,
      });
    }
  },
  onSettled: async (_data, _error, { file, folderKey }) => {
    const { removeProgress } = useProgressStore.getState();
    const fileName = file?.name.replace(/\s/g, '_');
    removeProgress(`${folderKey}-${fileName}`);
  },
  mutationFn: async ({ file, folderKey }) => {
    const chunkSize = 1024 * 1024 * 5;
    const totalChunks = Math.ceil(file.size / chunkSize);
    const fileName = file.name.replace(/\s/g, '_');

    // upload chunks
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(file.size, (i + 1) * chunkSize);
      const chunk = file.slice(start, end);
      await uploadChunk(folderKey, chunk, fileName, totalChunks, i);
    }
  },
};

export const moveFileMutationOption: UseMutationOptions<
  void,
  Error,
  { fileKey: string; targetKey: string }
> = {
  retry: retryCount,
  mutationFn: async ({ fileKey, targetKey }) => {
    await moveFile(fileKey, targetKey);
  },
};

export const renameFileMutationOption: UseMutationOptions<
  void,
  Error,
  { fileKey: string; fileName: string }
> = {
  retry: retryCount,
  mutationFn: async ({ fileKey, fileName }) => {
    await renameFile(fileKey, fileName);
  },
};

export const deleteFileMutationOption: UseMutationOptions<void, Error, string> = {
  retry: retryCount,
  mutationFn: async (fileKey: string) => {
    await deleteFile(fileKey);
  },
};