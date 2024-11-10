import { queryOptions, UseMutationOptions } from "@tanstack/react-query";
import { fileApi, memberApi, storageApi } from "./fetch";
import { ApiFileType, QueryError } from "@/interfaces/api";

export const normalRetryCount = 3;
export const shortStaleTime = 1000 * 60 * 1;
export const normalStaleTime = 1000 * 60 * 10;

// member
const getMember = queryOptions<
  Awaited<ReturnType<typeof memberApi.get>>["body"],
  QueryError
>({
  queryKey: ["member"],
  queryFn: async () => {
    const response = await memberApi.get();
    if (response.ok && response.body) {
      return response.body;
    } else {
      return Promise.reject({
        status: response.status,
        message: "Failed to get member",
      });
    }
  },
  retry: normalRetryCount,
  staleTime: normalStaleTime,
});
const createMember: UseMutationOptions<
  Awaited<ReturnType<typeof memberApi.create>>["body"],
  QueryError,
  void
> = {
  mutationFn: async () => {
    const response = await memberApi.create();
    if (response.ok && response.body) {
      return response.body;
    } else {
      return Promise.reject({
        status: response.status,
        message: "Failed to create member",
      });
    }
  },
  retry: normalRetryCount,
};
const deleteMember: UseMutationOptions<
  Awaited<ReturnType<typeof memberApi.delete>>["body"],
  QueryError,
  void
> = {
  retry: normalRetryCount,
  mutationFn: async () => {
    const response = await memberApi.delete();
    if (response.ok && response.body) {
      return response.body;
    } else {
      return Promise.reject({
        status: response.status,
        message: "Failed to delete member",
      });
    }
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
  QueryError,
  {
    parentKey: string;
    fileName: string;
  }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ parentKey, fileName }) => {
    const response = await fileApi.create.container(parentKey, fileName);
    if (response.ok && response.body) {
      return response.body;
    } else {
      return Promise.reject({
        status: response.status,
        message: "Failed to create file",
      });
    }
  },
};
// fileApi.delete
const deleteFilePermanent: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.delete.permanent>>["body"],
  QueryError,
  { fileKey: string }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey }) => {
    const response = await fileApi.delete.permanent(fileKey);
    if (response.ok && response.body) {
      return response.body;
    } else {
      return Promise.reject({
        status: response.status,
        message: "Failed to delete file",
      });
    }
  },
};
// fileApi.read
const readFileStorage = (fileKey: string) =>
  queryOptions<
    Awaited<ReturnType<typeof fileApi.read.storage>>["body"],
    QueryError
  >({
    queryKey: ["file", fileKey, "storage"],
    queryFn: async () => {
      const response = await fileApi.read.storage(fileKey);
      if (response.ok && response.body) {
        return response.body;
      } else {
        return Promise.reject({
          status: response.status,
          message: "File not found",
        });
      }
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!fileKey,
  });
const readFileRoot = queryOptions<
  Awaited<ReturnType<typeof fileApi.read.root>>["body"],
  QueryError
>({
  queryKey: ["root"],
  queryFn: async () => {
    const response = await fileApi.read.root();
    if (response.ok && response.body) {
      return response.body;
    } else {
      return Promise.reject({
        status: response.status,
        message: "File not found",
      });
    }
  },
  retry: normalRetryCount,
  staleTime: normalStaleTime,
});
const readFileHome = queryOptions<
  Awaited<ReturnType<typeof fileApi.read.home>>["body"],
  QueryError
>({
  queryKey: ["home"],
  queryFn: async () => {
    const response = await fileApi.read.home();
    if (response.ok && response.body) {
      return response.body;
    } else {
      return Promise.reject({
        status: response.status,
        message: "File not found",
      });
    }
  },
  retry: normalRetryCount,
  staleTime: normalStaleTime,
});
const readFileTrash = queryOptions<
  Awaited<ReturnType<typeof fileApi.read.trash>>["body"],
  QueryError
>({
  queryKey: ["trash"],
  queryFn: async () => {
    const response = await fileApi.read.trash();
    if (response.ok && response.body) {
      return response.body;
    } else {
      return Promise.reject({
        status: response.status,
        message: "File not found",
      });
    }
  },
  retry: normalRetryCount,
  staleTime: normalStaleTime,
});
const readFileInfo = (fileKey: string) =>
  queryOptions<
    {
      message: string;
      data: {
        fileName: string;
        type: ApiFileType;
        createDate: Date;
        updateDate: Date;
        byteSize: number;
      };
    },
    QueryError
  >({
    queryKey: ["file", fileKey, "info"],
    queryFn: async () => {
      const response = await fileApi.read.info(fileKey);
      if (response.ok && response.body) {
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
      } else {
        return Promise.reject({
          status: response.status,
          message: "File not found",
        });
      }
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!fileKey,
  });
const readFileParent = (fileKey: string) =>
  queryOptions<
    Awaited<ReturnType<typeof fileApi.read.parent>>["body"],
    QueryError
  >({
    queryKey: ["file", fileKey, "parent"],
    queryFn: async () => {
      const response = await fileApi.read.parent(fileKey);
      if (response.ok && response.body) {
        return response.body;
      } else {
        return Promise.reject({
          status: response.status,
          message: "File not found",
        });
      }
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!fileKey,
  });
const readFileChildren = (fileKey: string) =>
  queryOptions<
    Awaited<ReturnType<typeof fileApi.read.children>>["body"],
    QueryError
  >({
    queryKey: ["file", fileKey, "children"],
    queryFn: async () => {
      const response = await fileApi.read.children(fileKey);
      if (response.ok && response.body) {
        return response.body;
      } else {
        return Promise.reject({
          status: response.status,
          message: "File not found",
        });
      }
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!fileKey,
  });
const readFileFind = (fileKey: string, fileName: string) =>
  queryOptions<
    Awaited<ReturnType<typeof fileApi.read.find>>["body"],
    QueryError
  >({
    queryKey: ["file", fileKey, "find", fileName],
    queryFn: async () => {
      const response = await fileApi.read.find(fileKey, fileName);
      if (response.ok && response.body) {
        return response.body;
      } else {
        return Promise.reject({
          status: response.status,
          message: "File not found",
        });
      }
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!fileKey && !!fileName,
  });
const readFileLinkTarget = (fileKey: string) =>
  queryOptions<
    Awaited<ReturnType<typeof fileApi.read.linkTarget>>["body"],
    QueryError
  >({
    queryKey: ["file", fileKey, "target"],
    queryFn: async () => {
      const response = await fileApi.read.linkTarget(fileKey);
      if (response.ok && response.body) {
        return response.body;
      } else {
        return Promise.reject({
          status: response.status,
          message: "File not found",
        });
      }
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!fileKey,
  });
// fileApi.update
const updateFileName: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.update.name>>["body"],
  QueryError,
  { fileKey: string; fileName: string }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey, fileName }) => {
    const response = await fileApi.update.name(fileKey, fileName);
    if (response.ok && response.body) {
      return response.body;
    } else {
      return Promise.reject({
        status: response.status,
        message: "Failed to update file name",
      });
    }
  },
};
const updateFileParent: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.update.parent>>["body"],
  QueryError,
  { fileKey: string; parentKey: string }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey, parentKey }) => {
    const response = await fileApi.update.parent(fileKey, parentKey);
    if (response.ok && response.body) {
      return response.body;
    } else {
      return Promise.reject({
        status: response.status,
        message: "Failed to update file parent",
      });
    }
  },
};
const moveFileToTrash: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.update.trash>>["body"],
  QueryError,
  { fileKey: string }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey }) => {
    const response = await fileApi.update.trash(fileKey);
    if (response.ok && response.body) {
      return response.body;
    } else {
      return Promise.reject({
        status: response.status,
        message: "Failed to move file to trash",
      });
    }
  },
};
// fileApi.upload
const uploadFileWriteToken = (
  parentKey: string,
  fileName: string,
  byteSize: number,
) =>
  queryOptions<
    Awaited<ReturnType<typeof fileApi.upload.writeToken>>["body"],
    QueryError
  >({
    queryKey: ["file", parentKey, "writeToken", fileName],
    queryFn: async () => {
      const response = await fileApi.upload.writeToken(
        parentKey,
        fileName,
        byteSize,
      );
      if (response.ok && response.body) {
        return response.body;
      } else {
        return Promise.reject({
          status: response.status,
          message: "Failed to get write token",
        });
      }
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!parentKey && !!fileName,
  });
const uploadFileComplete: UseMutationOptions<
  Awaited<ReturnType<typeof fileApi.upload.complete>>["body"],
  QueryError,
  { fileKey: string; totalChunks: number }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey, totalChunks }) => {
    const response = await fileApi.upload.complete(fileKey, totalChunks);
    if (response.ok && response.body) {
      return response.body;
    } else {
      return Promise.reject({
        status: response.status,
        message: "Failed to complete file upload",
      });
    }
  },
};
// fileApi.stream
const streamFileReadToken = (fileKey: string) =>
  queryOptions<
    Awaited<ReturnType<typeof fileApi.stream.readToken>>["body"],
    QueryError
  >({
    queryKey: ["file", fileKey, "stream"],
    queryFn: async () => {
      const response = await fileApi.stream.readToken(fileKey);
      if (response.ok && response.body) {
        return response.body;
      } else {
        return Promise.reject({
          status: response.status,
          message: "Failed to get read token",
        });
      }
    },
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
  queryOptions<
    Awaited<ReturnType<typeof storageApi.file.download>>["body"],
    QueryError
  >({
    queryKey: ["storage", fileKey],
    queryFn: async () => {
      const response = await storageApi.file.download(fileKey, type);
      if (response.ok && response.body) {
        return response.body;
      } else {
        return Promise.reject({
          status: response.status,
          message: "Failed to download file",
        });
      }
    },
    retry: normalRetryCount,
    staleTime: normalStaleTime,
    enabled: !!fileKey,
  });
const writeStorageFile: UseMutationOptions<
  Awaited<ReturnType<typeof storageApi.file.write>>["body"],
  QueryError,
  { fileKey: string; chunkCount: number; fileData: Blob }
> = {
  retry: normalRetryCount,
  mutationFn: async ({ fileKey, chunkCount, fileData }) => {
    const response = await storageApi.file.write(fileKey, chunkCount, fileData);
    if (response.ok && response.body) {
      return response.body;
    } else {
      return Promise.reject({
        status: response.status,
        message: "Failed to write file",
      });
    }
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
  QueryError,
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
    if (response.ok && response.body) {
      const token = response.body.data.token;
      const fileKey = response.body.data.fileKey;
      const sessionResposne = await storageApi.session.issue(token);
      return Promise.resolve({
        fileKey,
        sessionResponse: sessionResposne.body,
      });
    } else {
      return Promise.reject({
        status: response.status,
        message: "Failed to issue write session",
      });
    }
  },
};
const issueReadSession = (fileKey: string) =>
  queryOptions<
    Awaited<ReturnType<typeof storageApi.session.issue>>["body"],
    QueryError
  >({
    queryKey: ["storage", "session", "read", fileKey],
    queryFn: async () => {
      let token = "";
      token = await fileApi.stream.readToken(fileKey).then((res) => {
        if (res.ok && res.body) {
          return res.body.data.token;
        } else {
          return Promise.reject(new Error("Failed to issue read session"));
        }
      });
      const response = await storageApi.session.issue(token);
      if (response.ok && response.body) {
        return response.body;
      } else {
        return Promise.reject({
          status: response.status,
          message: "Failed to issue read session",
        });
      }
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
