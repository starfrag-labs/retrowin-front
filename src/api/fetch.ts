import { ApiFileType } from "@/interfaces/api";
import { CustomResponse, CustomStorageResponse } from "@/interfaces/api";

export const cloudApiBase = process.env.NEXT_PUBLIC_CLOUD_API_BASE;
export const storageApiBase = process.env.NEXT_PUBLIC_STORAGE_API_BASE;

export const url = {
  member: {
    get: "/member",
    create: "/member",
    delete: "/member",
    status: "/member/status",
  },
  file: {
    create: {
      container: (parentKey: string, fileName: string) =>
        `/file/container/${parentKey}?file_name=${fileName}`,
      link: (parentKey: string, fileName: string, targetKey: string) =>
        `/file/link/${parentKey}?file_name=${fileName}&target_key=${targetKey}`,
    },
    delete: {
      permanent: (fileKey: string) => `/file/permanent/${fileKey}`,
    },
    read: {
      storage: (fileKey: string) => `/file/storage/${fileKey}`,
      root: "/file/root",
      home: "/file/home",
      trash: "/file/trash",
      info: (fileKey: string) => `/file/info/${fileKey}`,
      parent: (fileKey: string) => `/file/parent/${fileKey}`,
      children: (fileKey: string) => `/file/children/${fileKey}`,
      find: (fileKey: string, fileName: string) =>
        `/file/find/${fileKey}?file_name=${fileName}`,
      linkTarget: (fileKey: string) => `/file/link-target/${fileKey}`,
    },
    update: {
      name: (fileKey: string, fileName: string) =>
        `/file/name/${fileKey}?file_name=${fileName}`,
      parent: (fileKey: string, parentKey: string) =>
        `/file/parent/${fileKey}?parent_key=${parentKey}`,
      trash: (fileKey: string) => `/file/trash/${fileKey}`,
    },
    upload: {
      writeToken: (parentKey: string, fileName: string, byteSize: number) =>
        `/file/upload/write-token/${parentKey}?file_name=${fileName}&byte_size=${byteSize}`,
      complete: (fileKey: string, totalChunks: number) =>
        `/file/upload/complete/${fileKey}?total_chunks=${totalChunks}`,
    },
    stream: {
      readToken: (fileKey: string) => `/file/stream/read-token/${fileKey}`,
    },
  },
  storage: {
    file: {
      // get source directly from storage
      read: (fileKey: string, type: "original" = "original") =>
        new URL(`/read/bare/${fileKey}/${type}`, storageApiBase),
      readWithName: (fileKey: string, fileName: string) =>
        new URL(
          `/read/with-name/${fileKey}?file_name=${fileName}`,
          storageApiBase,
        ),
      write: (fileKey: string) => `/write/${fileKey}`,
    },
    session: {
      issue: (token: string) => `/session/issue/${token}`,
    },
  },
};

/**
 * Custom fetch function
 * @param input url string
 * @param init fetch options
 * @param useToken token use option
 * @returns promise of json response
 */
const customFetch = async <T = unknown>(
  input: string | URL | globalThis.Request,
  init?: RequestInit,
  base: "cloud" | "storage" = "cloud",
  bodyType: "json" | "blob" = "json",
) => {
  // create a new URL object with the input string
  let url: URL;
  switch (base) {
    case "cloud":
      url = new URL(input as string, cloudApiBase);
      break;
    case "storage":
      url = new URL(input as string, storageApiBase);
      break;
  }
  const response = await fetch(url, {
    ...init,
    //headers: {
    //  // pass the other headers along
    //  ...init?.headers,
    //},
    credentials: "include",
  });

  let body: T;
  switch (bodyType) {
    case "json":
      body = (await response.json()) as T;
      break;
    case "blob":
      if (response.status !== 200) {
        body = (await response.json()) as T;
      } else {
        body = (await response.blob()) as T;
      }
      break;
    default:
      body = (await response.json()) as T;
      break;
  }

  return {
    ok: response.ok, // pass the ok along
    headers: response.headers, // pass the headers along
    status: response.headers, // pass the status along
    body, // pass the body along
  };
};

/**
 * Custom fetch function
 * @returns promise of json response
 */
export const memberApi = {
  get: () =>
    customFetch<
      CustomResponse<{
        uuidKey: string;
      }>
    >(url.member.get),
  create: () =>
    customFetch<
      CustomResponse<{
        uuidKey: string;
      }>
    >(url.member.create, {
      method: "POST",
    }),
  delete: () =>
    customFetch<
      CustomResponse<{
        uuidKey: string;
      }>
    >(url.member.delete, {
      method: "DELETE",
    }),
  status: () => customFetch<unknown>(url.member.status),
};
export const fileApi = {
  create: {
    container: (parentKey: string, fileName: string) =>
      customFetch<
        CustomResponse<{
          fileKey: string;
          fileName: string;
          type: ApiFileType;
        }>
      >(url.file.create.container(parentKey, fileName), {
        method: "POST",
      }),
  },
  delete: {
    permanent: (fileKey: string) =>
      customFetch<
        CustomResponse<{
          fileKey: string;
          fileName: string;
          type: ApiFileType;
        }>
      >(url.file.delete.permanent(fileKey), {
        method: "DELETE",
      }),
  },
  read: {
    storage: (fileKey: string) =>
      customFetch<
        CustomResponse<{
          token: string;
        }>
      >(url.file.read.storage(fileKey)),
    root: customFetch<
      CustomResponse<{
        fileKey: string;
        fileName: string;
        type: ApiFileType;
      }>
    >(url.file.read.root),
    home: customFetch<
      CustomResponse<{
        fileKey: string;
        fileName: string;
        type: ApiFileType;
      }>
    >(url.file.read.home),
    trash: customFetch<
      CustomResponse<{
        fileKey: string;
        fileName: string;
        type: ApiFileType;
      }>
    >(url.file.read.trash),
    info: (fileKey: string) =>
      customFetch<
        CustomResponse<{
          fileName: string;
          type: ApiFileType;
          createDate: string;
          updateDate: string;
          byteSize: number;
        }>
      >(url.file.read.info(fileKey)),
    parent: (fileKey: string) =>
      customFetch<
        CustomResponse<{
          fileKey: string;
          fileName: string;
          type: ApiFileType;
        }>
      >(url.file.read.parent(fileKey)),
    children: (fileKey: string) =>
      customFetch<
        CustomResponse<
          {
            fileKey: string;
            fileName: string;
            type: ApiFileType;
          }[]
        >
      >(url.file.read.children(fileKey)),
    find: (fileKey: string, fileName: string) =>
      customFetch<
        CustomResponse<{
          fileKey: string;
          fileName: string;
          type: ApiFileType;
        }>
      >(url.file.read.find(fileKey, fileName)),
    linkTarget: (fileKey: string) =>
      customFetch<
        CustomResponse<{
          fileKey: string;
          fileName: string;
          type: ApiFileType;
        }>
      >(url.file.read.linkTarget(fileKey)),
  },
  update: {
    name: (fileKey: string, fileName: string) =>
      customFetch<
        CustomResponse<{
          fileKey: string;
          fileName: string;
          type: ApiFileType;
        }>
      >(url.file.update.name(fileKey, fileName), {
        method: "PATCH",
      }),
    parent: (fileKey: string, parentKey: string) =>
      customFetch<
        CustomResponse<{
          success: boolean;
        }>
      >(url.file.update.parent(fileKey, parentKey), {
        method: "PATCH",
      }),
    trash: (fileKey: string) =>
      customFetch<
        CustomResponse<{
          fileKey: string;
          fileName: string;
          type: ApiFileType;
        }>
      >(url.file.update.trash(fileKey), {
        method: "PATCH",
      }),
  },
  upload: {
    writeToken: (parentKey: string, fileName: string, byteSize: number) =>
      customFetch<
        CustomResponse<{
          token: string;
          fileKey: string;
        }>
      >(url.file.upload.writeToken(parentKey, fileName, byteSize)),
    complete: (fileKey: string, totalChunks: number) =>
      customFetch<
        CustomResponse<{
          fileKey: string;
          fileName: string;
          type: ApiFileType;
        }>
      >(url.file.upload.complete(fileKey, totalChunks), {
        method: "PATCH",
      }),
  },
  stream: {
    readToken: (fileKey: string) =>
      customFetch<
        CustomResponse<{
          token: string;
        }>
      >(url.file.stream.readToken(fileKey)),
  },
};
export const storageApi = {
  file: {
    download: (fileKey: string, type: "original" = "original") =>
      customFetch<Blob>(
        url.storage.file.read(fileKey, type),
        {
          method: "GET",
        },
        "storage",
        "blob",
      ),
    write: (fileKey: string, chunkCount: number, fileData: Blob) => {
      const formData = new FormData();
      formData.append("chunkCount", chunkCount.toString());
      formData.append("fileData", fileData);
      return customFetch<
        CustomStorageResponse<{
          message: string;
        }>
      >(
        url.storage.file.write(fileKey),
        {
          method: "POST",
          body: formData,
        },
        "storage",
      );
    },
  },
  session: {
    issue: (token: string) =>
      customFetch<
        CustomStorageResponse<{
          message: string;
        }>
      >(
        url.storage.session.issue(token),
        {
          method: "GET",
        },
        "storage",
      ),
  },
};
