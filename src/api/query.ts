import { queryOptions, UseMutationOptions } from "@tanstack/react-query";
import { fileApi, memberApi, storageApi } from "./fetch";

const normalRetryCount = 3;
const normalStaleTime = 1000 * 60 * 10;

// member
const getMember = queryOptions({
  queryKey: ["member"],
  queryFn: async () => await memberApi.get(),
  retry: normalRetryCount,
  staleTime: normalStaleTime,
});
const createMember: UseMutationOptions<
  Awaited<ReturnType<typeof memberApi.create>>,
  Error,
  void
> = {
  retry: normalRetryCount,
  mutationFn: async () => await memberApi.create(),
};
const deleteMember: UseMutationOptions = {
  retry: normalRetryCount,
  mutationFn: async () => await memberApi.delete(),
};
export const memberQuery = {
  get: getMember,
  create: createMember,
  delete: deleteMember,
};

// file
// fileApi.create
const createFile: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.create.container>>,
  Error,
  {
    parentKey: string;
    fileName: string;
  }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ parentKey, fileName }) =>
    await fileApi.create.container(parentKey, fileName),
};
// fileApi.delete
const deleteFilePermanent: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.delete.permanent>>,
  Error,
  { fileKey: string }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey }) => await fileApi.delete.permanent(fileKey),
};
const deleteFileToTrash: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.delete.trash>>,
  Error,
  { fileKey: string }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey }) => await fileApi.delete.trash(fileKey),
};
// fileApi.read
const readFileStorage = (fileKey: string) =>
  queryOptions({
    queryKey: ["file", "storage", fileKey],
    queryFn: async () => await fileApi.read.storage(fileKey),
    retry: normalRetryCount,
    staleTime: normalStaleTime,
  });
const readFileRoot = (fileKey: string) =>
  queryOptions({
    queryKey: ["file", "root", fileKey],
    queryFn: async () => await fileApi.read.root(fileKey),
    retry: normalRetryCount,
    staleTime: normalStaleTime,
  });
const readFileInfo = (fileKey: string) =>
  queryOptions({
    queryKey: ["file", "info", fileKey],
    queryFn: async () => await fileApi.read.info(fileKey),
    retry: normalRetryCount,
    staleTime: normalStaleTime,
  });
const readFileParent = (fileKey: string) =>
  queryOptions({
    queryKey: ["file", "parent", fileKey],
    queryFn: async () => await fileApi.read.parent(fileKey),
    retry: normalRetryCount,
    staleTime: normalStaleTime,
  });
const readFileChildren = (fileKey: string) =>
  queryOptions({
    queryKey: ["file", "children", fileKey],
    queryFn: async () => await fileApi.read.children(fileKey),
    retry: normalRetryCount,
    staleTime: normalStaleTime,
  });
const readFileFind = (fileKey: string, fileName: string) =>
  queryOptions({
    queryKey: ["file", "find", fileKey],
    queryFn: async () => await fileApi.read.find(fileKey, fileName),
    retry: normalRetryCount,
    staleTime: normalStaleTime,
  });
// fileApi.update
const updateFileName: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.update.name>>,
  Error,
  { fileKey: string; fileName: string }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey, fileName }) =>
    await fileApi.update.name(fileKey, fileName),
};
const updateFileParent: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.update.parent>>,
  Error,
  { fileKey: string; parentKey: string }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey, parentKey }) =>
    await fileApi.update.parent(fileKey, parentKey),
};
// fileApi.upload
const uploadFileWriteToken = (
  parentKey: string,
  fileName: string,
  byteSize: number,
) =>
  queryOptions({
    queryKey: ["file", "writeToken", parentKey, fileName],
    queryFn: async () =>
      await fileApi.upload.writeToken(parentKey, fileName, byteSize),
    retry: normalRetryCount,
    staleTime: normalStaleTime,
  });
const uploadFileComplete: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.upload.complete>>,
  Error,
  { fileKey: string; totalChunks: number }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey, totalChunks }) =>
    await fileApi.upload.complete(fileKey, totalChunks),
};
// fileApi.stream
const streamFileReadToken = (fileKey: string) =>
  queryOptions({
    queryKey: ["file", "stream", fileKey],
    queryFn: async () => await fileApi.stream.readToken(fileKey),
    retry: normalRetryCount,
    staleTime: normalStaleTime,
  });
export const fileQuery = {
  create: {
    container: createFile,
  },
  delete: {
    permanent: deleteFilePermanent,
    trash: deleteFileToTrash,
  },
  read: {
    storage: readFileStorage,
    root: readFileRoot,
    info: readFileInfo,
    parent: readFileParent,
    children: readFileChildren,
    find: readFileFind,
  },
  update: {
    name: updateFileName,
    parent: updateFileParent,
  },
  upload: {
    writeToken: uploadFileWriteToken,
    complete: uploadFileComplete,
  },
  stream: {
    readToken: streamFileReadToken,
  },
};

// storage
// storageApi.file
const readStorageFile = (fileKey: string, fileName: string) =>
  queryOptions({
    queryKey: ["storage", "file", fileKey, fileName],
    queryFn: async () => await storageApi.file.read(fileKey, fileName),
    retry: normalRetryCount,
    staleTime: normalStaleTime,
  });
const writeStorageFile: UseMutationOptions<
  Awaited<ReturnType<typeof storageApi.file.write>>,
  Error,
  { fileKey: string; chunkCount: number; fileData: Blob }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey, chunkCount, fileData }) =>
    await storageApi.file.write(fileKey, chunkCount, fileData),
};
// storageApi.session
const issueSession = (token: string) =>
  queryOptions({
    queryKey: ["storage", "session", "issue"],
    queryFn: async () => await storageApi.session.issue(token),
    retry: normalRetryCount,
    staleTime: normalStaleTime,
  });
export const storageQuery = {
  file: {
    read: readStorageFile,
    write: writeStorageFile,
  },
  session: {
    issue: issueSession,
  },
};
