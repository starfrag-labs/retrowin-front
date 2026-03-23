import { HttpResponse, http } from "msw";
import type { FileType } from "@/interfaces/file";
import {
  createFile,
  deleteFile,
  getChildren,
  getFile,
  HOME_KEY,
  moveToTrash,
  ROOT_KEY,
  TRASH_KEY,
  updateFileName,
  updateFileParent,
} from "./data";

export const handlers = [
  // Member endpoints
  http.get("/member", () => {
    return HttpResponse.json({
      message: "Success",
      data: { uuidKey: "mock-user-uuid" },
    });
  }),

  http.post("/member", () => {
    return HttpResponse.json({
      message: "Success",
      data: { uuidKey: "mock-user-uuid" },
    });
  }),

  http.delete("/member", () => {
    return HttpResponse.json({
      message: "Success",
      data: { uuidKey: "mock-user-uuid" },
    });
  }),

  http.get("/member/status", () => {
    return HttpResponse.json({
      message: "Success",
      data: { status: "active" },
    });
  }),

  // File endpoints - Create
  http.post("/file/container/:parentKey", ({ params, request }) => {
    const parentKey = params.parentKey as string;
    const url = new URL(request.url);
    const fileName = url.searchParams.get("file_name") ?? "New Folder";

    const parent = getFile(parentKey);
    if (!parent) {
      return HttpResponse.json(
        { message: "Parent not found", data: null },
        { status: 404 }
      );
    }

    const newFile = createFile(parentKey, fileName, "container" as FileType);
    return HttpResponse.json({
      message: "Success",
      data: {
        fileKey: newFile.fileKey,
        fileName: newFile.fileName,
        type: newFile.type,
      },
    });
  }),

  http.post("/file/link/:parentKey", ({ params, request }) => {
    const parentKey = params.parentKey as string;
    const url = new URL(request.url);
    const fileName = url.searchParams.get("file_name") ?? "New Link";

    const parent = getFile(parentKey);
    if (!parent) {
      return HttpResponse.json(
        { message: "Parent not found", data: null },
        { status: 404 }
      );
    }

    const newFile = createFile(parentKey, fileName, "link" as FileType);
    return HttpResponse.json({
      message: "Success",
      data: {
        fileKey: newFile.fileKey,
        fileName: newFile.fileName,
        type: newFile.type,
      },
    });
  }),

  // File endpoints - Delete
  http.delete("/file/permanent/:fileKey", ({ params }) => {
    const file = deleteFile(params.fileKey as string);
    if (!file) {
      return HttpResponse.json(
        { message: "File not found", data: null },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      message: "Success",
      data: {
        fileKey: file.fileKey,
        fileName: file.fileName,
        type: file.type,
      },
    });
  }),

  // File endpoints - Read
  http.get("/file/storage/:fileKey", ({ params }) => {
    const file = getFile(params.fileKey as string);
    if (!file) {
      return HttpResponse.json(
        { message: "File not found", data: null },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      message: "Success",
      data: { token: `mock-token-${params.fileKey}` },
    });
  }),

  http.get("/file/root", () => {
    const root = getFile(ROOT_KEY);
    return HttpResponse.json({
      message: "Success",
      data: root,
    });
  }),

  http.get("/file/home", () => {
    const home = getFile(HOME_KEY);
    return HttpResponse.json({
      message: "Success",
      data: home,
    });
  }),

  http.get("/file/trash", () => {
    const trash = getFile(TRASH_KEY);
    return HttpResponse.json({
      message: "Success",
      data: trash,
    });
  }),

  http.get("/file/info/:fileKey", ({ params }) => {
    const file = getFile(params.fileKey as string);
    if (!file) {
      return HttpResponse.json(
        { message: "File not found", data: null },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      message: "Success",
      data: {
        fileName: file.fileName,
        type: file.type,
        createDate: file.createDate,
        updateDate: file.updateDate,
        byteSize: file.byteSize,
      },
    });
  }),

  http.get("/file/parent/:fileKey", ({ params }) => {
    const file = getFile(params.fileKey as string);
    if (!file || !file.parentKey) {
      return HttpResponse.json(
        { message: "Parent not found", data: null },
        { status: 404 }
      );
    }
    const parent = getFile(file.parentKey);
    return HttpResponse.json({
      message: "Success",
      data: parent,
    });
  }),

  http.get("/file/children/:fileKey", ({ params }) => {
    const children = getChildren(params.fileKey as string);
    return HttpResponse.json({
      message: "Success",
      data: children.map((f) => ({
        fileKey: f.fileKey,
        fileName: f.fileName,
        type: f.type,
      })),
    });
  }),

  http.get("/file/find/:fileKey", ({ params, request }) => {
    const url = new URL(request.url);
    const fileName = url.searchParams.get("file_name");
    const children = getChildren(params.fileKey as string);
    const file = children.find((f) => f.fileName === fileName);

    if (!file) {
      return HttpResponse.json(
        { message: "File not found", data: null },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      message: "Success",
      data: file,
    });
  }),

  http.get("/file/link-target/:fileKey", ({ params }) => {
    const file = getFile(params.fileKey as string);
    if (!file) {
      return HttpResponse.json(
        { message: "File not found", data: null },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      message: "Success",
      data: file,
    });
  }),

  // File endpoints - Update
  http.patch("/file/name/:fileKey", ({ params, request }) => {
    const url = new URL(request.url);
    const fileName = url.searchParams.get("file_name");
    if (!fileName) {
      return HttpResponse.json(
        { message: "File name required", data: null },
        { status: 400 }
      );
    }
    const file = updateFileName(params.fileKey as string, fileName);
    if (!file) {
      return HttpResponse.json(
        { message: "File not found", data: null },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      message: "Success",
      data: file,
    });
  }),

  http.patch("/file/parent/:fileKey", ({ params, request }) => {
    const url = new URL(request.url);
    const parentKey = url.searchParams.get("parent_key");
    if (!parentKey) {
      return HttpResponse.json(
        { message: "Parent key required", data: null },
        { status: 400 }
      );
    }
    const file = updateFileParent(params.fileKey as string, parentKey);
    if (!file) {
      return HttpResponse.json(
        { message: "File not found", data: null },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      message: "Success",
      data: { success: true },
    });
  }),

  http.patch("/file/trash/:fileKey", ({ params }) => {
    const file = moveToTrash(params.fileKey as string);
    if (!file) {
      return HttpResponse.json(
        { message: "File not found", data: null },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      message: "Success",
      data: file,
    });
  }),

  // Upload endpoints
  http.get("/file/upload/write-token/:parentKey", ({ params, request }) => {
    const url = new URL(request.url);
    const fileName = url.searchParams.get("file_name") ?? "file";
    const byteSize = Number.parseInt(
      url.searchParams.get("byte_size") ?? "0",
      10
    );

    const newFile = createFile(
      params.parentKey as string,
      fileName,
      "block" as FileType
    );
    newFile.byteSize = byteSize;

    return HttpResponse.json({
      message: "Success",
      data: {
        token: `mock-upload-token-${newFile.fileKey}`,
        fileKey: newFile.fileKey,
      },
    });
  }),

  http.patch("/file/upload/complete/:fileKey", ({ params }) => {
    const file = getFile(params.fileKey as string);

    if (!file) {
      return HttpResponse.json(
        { message: "File not found", data: null },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      message: "Success",
      data: {
        fileKey: file.fileKey,
        fileName: file.fileName,
        type: file.type,
      },
    });
  }),

  // Stream endpoints
  http.get("/file/stream/read-token/:fileKey", ({ params }) => {
    const file = getFile(params.fileKey as string);
    if (!file) {
      return HttpResponse.json(
        { message: "File not found", data: null },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      message: "Success",
      data: { token: `mock-read-token-${params.fileKey}` },
    });
  }),

  // Storage endpoints
  http.get("/read/bare/:fileKey/:type", () => {
    return new HttpResponse(new ArrayBuffer(0), {
      headers: { "Content-Type": "application/octet-stream" },
    });
  }),

  http.get("/read/with-name/:fileKey", ({ params }) => {
    const file = getFile(params.fileKey as string);
    if (!file) {
      return HttpResponse.json(
        { message: "File not found", data: null },
        { status: 404 }
      );
    }
    return new HttpResponse(new ArrayBuffer(0), {
      headers: { "Content-Type": "application/octet-stream" },
    });
  }),

  http.post("/write/:fileKey", () => {
    return HttpResponse.json({
      message: "Success",
      data: { message: "Upload complete" },
    });
  }),

  // Session endpoints
  http.get("/session/issue/:token", () => {
    return HttpResponse.json({
      message: "Success",
      data: { message: "Session issued" },
    });
  }),
];
