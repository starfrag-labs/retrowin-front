import { queryOptions, UseMutationOptions } from "@tanstack/react-query";
import { fileApi, memberApi, storageApi } from "./fetch";

export const normalRetryCount = 3;
export const shortStaleTime = 1000 * 60 * 1;
export const normalStaleTime = 1000 * 60 * 10;

// member
const getMember = queryOptions({
  queryKey: ["member"],
  queryFn: async () => {
    const response = await memberApi.get();
    return response.body;
  },
  retry: normalRetryCount,
  staleTime: normalStaleTime,
});
const createMember: UseMutationOptions<
  Awaited<ReturnType<typeof memberApi.create>>["body"],
  Error,
  void
> = {
  retry: normalRetryCount,
  mutationFn: async () => {
    const response = await memberApi.create();
    return response.body;
  },
};
const deleteMember: UseMutationOptions<
  Awaited<ReturnType<typeof memberApi.delete>>["body"],
  Error,
  void
> = {
  retry: normalRetryCount,
  mutationFn: async () => {
    const response = await memberApi.delete();
    return response.body;
  },
};
export const memberQuery = {
  get: getMember,
  create: createMember,
  delete: deleteMember,
};

// file
// fileApi.create
const createFile: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.create.container>>["body"],
  Error,
  {
    parentKey: string;
    fileName: string;
  }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ parentKey, fileName }) => {
    const response = await fileApi.create.container(parentKey, fileName);
    return response.body;
  },
};
// fileApi.delete
const deleteFilePermanent: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.delete.permanent>>["body"],
  Error,
  { fileKey: string }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey }) => {
    const response = await fileApi.delete.permanent(fileKey);
    return response.body;
  },
};
// fileApi.read
const readFileStorage = (fileKey: string) =>
  queryOptions({
    queryKey: ["file", fileKey, "storage"],
    queryFn: async () => {
      const response = await fileApi.read.storage(fileKey);
      return response.body;
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!fileKey,
  });
const readFileRoot = queryOptions({
  queryKey: ["file", "root"],
  queryFn: async () => {
    const response = await fileApi.read.root();
    return response.body;
  },
  retry: normalRetryCount,
  staleTime: normalStaleTime,
});
const readFileHome = queryOptions({
  queryKey: ["file", "home"],
  queryFn: async () => {
    const response = await fileApi.read.home();
    if (response.status === 404) {
      return Promise.reject(new Error("Home not found"));
    } else {
      return response.body;
    }
  },
  retry: normalRetryCount,
  staleTime: normalStaleTime,
});
const readFileTrash = queryOptions({
  queryKey: ["file", "trash"],
  queryFn: async () => {
    const response = await fileApi.read.trash();
    return response.body;
  },
  retry: normalRetryCount,
  staleTime: normalStaleTime,
});
const readFileInfo = (fileKey: string) =>
  queryOptions({
    queryKey: ["file", fileKey, "info"],
    queryFn: async () => {
      const response = await fileApi.read.info(fileKey);
      const createDate = new Date(response.body.data.createDate);
      const updateDate = new Date(response.body.data.updateDate);
      return {
        ...response.body,
        data: {
          ...response.body.data,
          createDate,
          updateDate,
        },
      };
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!fileKey,
  });
const readFileParent = (fileKey: string) =>
  queryOptions({
    queryKey: ["file", fileKey, "parent"],
    queryFn: async () => {
      const response = await fileApi.read.parent(fileKey);
      return response.body;
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!fileKey,
  });
const readFileChildren = (fileKey: string) =>
  queryOptions({
    queryKey: ["file", fileKey, "children"],
    queryFn: async () => {
      const response = await fileApi.read.children(fileKey);
      return response.body;
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!fileKey,
  });
const readFileFind = (fileKey: string, fileName: string) =>
  queryOptions({
    queryKey: ["file", fileKey, "find", fileName],
    queryFn: async () => {
      const response = await fileApi.read.find(fileKey, fileName);
      return response.body;
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!fileKey && !!fileName,
  });
const readFileLinkTarget = (fileKey: string) =>
  queryOptions({
    queryKey: ["file", fileKey, "target"],
    queryFn: async () => {
      const response = await fileApi.read.linkTarget(fileKey);
      return response.body;
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!fileKey,
  });
// fileApi.update
const updateFileName: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.update.name>>["body"],
  Error,
  { fileKey: string; fileName: string }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey, fileName }) => {
    const response = await fileApi.update.name(fileKey, fileName);
    return response.body;
  },
};
const updateFileParent: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.update.parent>>["body"],
  Error,
  { fileKey: string; parentKey: string }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey, parentKey }) => {
    const response = await fileApi.update.parent(fileKey, parentKey);
    return response.body;
  },
};
const moveFileToTrash: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.update.trash>>["body"],
  Error,
  { fileKey: string }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey }) => {
    const response = await fileApi.update.trash(fileKey);
    return response.body;
  },
};
// fileApi.upload
const uploadFileWriteToken = (
  parentKey: string,
  fileName: string,
  byteSize: number,
) =>
  queryOptions({
    queryKey: ["file", parentKey, "writeToken", fileName],
    queryFn: async () => {
      const response = await fileApi.upload.writeToken(
        parentKey,
        fileName,
        byteSize,
      );
      return response.body;
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!parentKey && !!fileName,
  });
const uploadFileComplete: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.upload.complete>>["body"],
  Error,
  { fileKey: string; totalChunks: number }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey, totalChunks }) => {
    const response = await fileApi.upload.complete(fileKey, totalChunks);
    return response.body;
  },
};
// fileApi.stream
const streamFileReadToken = (fileKey: string) =>
  queryOptions({
    queryKey: ["file", fileKey, "stream"],
    queryFn: async () => await fileApi.stream.readToken(fileKey),
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!fileKey,
  });
export const fileQuery = {
  create: {
    container: createFile,
  },
  delete: {
    permanent: deleteFilePermanent,
  },
  read: {
    storage: readFileStorage,
    root: readFileRoot,
    home: readFileHome,
    trash: readFileTrash,
    info: readFileInfo,
    parent: readFileParent,
    children: readFileChildren,
    find: readFileFind,
    linkTarget: readFileLinkTarget,
  },
  update: {
    name: updateFileName,
    parent: updateFileParent,
    trash: moveFileToTrash,
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
const downloadStorageFile = ({
  fileKey,
  type = "original",
}: {
  fileKey: string;
  type?: "original";
}) =>
  queryOptions({
    queryKey: ["storage", fileKey],
    queryFn: async () => {
      const response = await storageApi.file.download(fileKey, type);
      return response.body;
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!fileKey,
  });
const writeStorageFile: UseMutationOptions<
  Awaited<ReturnType<typeof storageApi.file.write>>["body"],
  Error,
  { fileKey: string; chunkCount: number; fileData: Blob }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey, chunkCount, fileData }) => {
    const response = await storageApi.file.write(fileKey, chunkCount, fileData);
    return response.body;
  },
};
// storageApi.session
const issueWriteSession: UseMutationOptions<
  {
    fileKey: string;
    sessionResponse: Awaited<
      ReturnType<typeof storageApi.session.issue>
    >["body"];
  },
  Error,
  {
    targetContainerKey: string;
    fileName: string;
    size: number;
  }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ targetContainerKey, fileName, size }) => {
    const response = await fileApi.upload.writeToken(
      targetContainerKey,
      fileName,
      size,
    );
    const token = response.body.data.token;
    const fileKey = response.body.data.fileKey;
    const sessionResposne = await storageApi.session.issue(token);
    return { fileKey, sessionResponse: sessionResposne.body };
  },
};
const issueReadSession = (fileKey: string) =>
  queryOptions({
    queryKey: ["storage", "session", "read", fileKey],
    queryFn: async () => {
      let token = "";
      token = await fileApi.stream
        .readToken(fileKey)
        .then((res) => res.body.data.token);
      const response = await storageApi.session.issue(token);
      return response.body;
    },
    retry: normalRetryCount,
    staleTime: shortStaleTime,
    enabled: !!fileKey,
  });
export const storageQuery = {
  file: {
    download: downloadStorageFile,
    write: writeStorageFile,
  },
  session: {
    read: issueReadSession,
    write: issueWriteSession,
  },
};
