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
  // User endpoints
  http.get("/user", () => {
    return HttpResponse.json({
      user: {
        id: 1,
        provider: "keycloak" as const,
        providerId: "mock-provider-id",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  http.post("/user", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      user: {
        id: 1,
        provider: (body as { provider?: string }).provider || "keycloak",
        providerId: "mock-provider-id",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  http.delete("/user", () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // File endpoints - Get special containers
  http.get("/file/root", () => {
    const root = getFile(ROOT_KEY);
    if (!root) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "Root not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      file: toApiFile(root),
    });
  }),

  http.get("/file/home", () => {
    const home = getFile(HOME_KEY);
    if (!home) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "Home not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      file: toApiFile(home),
    });
  }),

  http.get("/file/trash", () => {
    const trash = getFile(TRASH_KEY);
    if (!trash) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "Trash not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      file: toApiFile(trash),
    });
  }),

  // File endpoints - Get file info
  http.get("/file/info/:fileKey", ({ params }) => {
    const file = getFile(params.fileKey as string);
    if (!file) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "File not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      file: toApiFile(file),
    });
  }),

  // File endpoints - Get children
  http.get("/file/children/:fileKey", ({ params }) => {
    const children = getChildren(params.fileKey as string);
    return HttpResponse.json({
      files: children.map(toApiFile),
    });
  }),

  // File endpoints - Create file/container
  http.post("/file", async ({ request }) => {
    const body = (await request.json()) as {
      type?: "container" | "file";
      fileName?: string;
      parentKey?: string | null;
    };
    const { type = "container", fileName = "New File", parentKey } = body;

    if (!parentKey) {
      return HttpResponse.json(
        { error: { type: "bad_request", message: "parentKey is required" } },
        { status: 400 }
      );
    }

    const parent = getFile(parentKey);
    if (!parent) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "Parent not found" } },
        { status: 404 }
      );
    }

    const newFile = createFile(
      parentKey,
      fileName,
      type === "file" ? ("block" as FileType) : ("container" as FileType)
    );
    return HttpResponse.json(
      {
        file: toApiFile(newFile),
      },
      { status: 201 }
    );
  }),

  // File endpoints - Update file
  http.patch("/file/:fileKey", async ({ params, request }) => {
    const body = (await request.json()) as { fileName?: string };
    const file = updateFileName(params.fileKey as string, body.fileName ?? "");
    if (!file) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "File not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      file: toApiFile(file),
    });
  }),

  // File endpoints - Delete file (move to trash)
  http.delete("/file/:fileKey", ({ params, request }) => {
    const url = new URL(request.url);
    const permanent = url.searchParams.get("permanent");

    if (permanent === "true") {
      const file = deleteFile(params.fileKey as string);
      if (!file) {
        return HttpResponse.json(
          { error: { type: "not_found", message: "File not found" } },
          { status: 404 }
        );
      }
      return new HttpResponse(null, { status: 204 });
    } else {
      const file = moveToTrash(params.fileKey as string);
      if (!file) {
        return HttpResponse.json(
          { error: { type: "not_found", message: "File not found" } },
          { status: 404 }
        );
      }
      return HttpResponse.json({
        file: toApiFile(file),
      });
    }
  }),

  // File endpoints - Move file
  http.post("/file/:fileKey/move", async ({ params, request }) => {
    const body = (await request.json()) as { targetKey?: string };
    const { targetKey } = body;

    if (!targetKey) {
      return HttpResponse.json(
        { error: { type: "bad_request", message: "targetKey is required" } },
        { status: 400 }
      );
    }

    const file = updateFileParent(params.fileKey as string, targetKey);
    if (!file) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "File not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      file: toApiFile(file),
    });
  }),

  // File endpoints - Copy file (not fully implemented for mock)
  http.post("/file/:fileKey/copy", async ({ params, request }) => {
    const body = (await request.json()) as { targetKey?: string };
    const { targetKey } = body;

    if (!targetKey) {
      return HttpResponse.json(
        { error: { type: "bad_request", message: "targetKey is required" } },
        { status: 400 }
      );
    }

    // For simplicity, just return a copy of the file with a new key
    const originalFile = getFile(params.fileKey as string);
    if (!originalFile) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "File not found" } },
        { status: 404 }
      );
    }

    const newFile = createFile(
      targetKey,
      `${originalFile.fileName} (copy)`,
      originalFile.type
    );
    return HttpResponse.json(
      {
        file: toApiFile(newFile),
      },
      { status: 201 }
    );
  }),

  // Upload endpoints - Get write token
  http.get("/file/upload/write-token/:fileKey", ({ params }) => {
    const file = getFile(params.fileKey as string);
    if (!file) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "File not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      uploadToken: {
        token: `mock-upload-token-${params.fileKey}`,
        uploadUrl: "https://mock-storage.example.com/upload",
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      },
    });
  }),

  // Upload endpoints - Complete upload
  http.patch("/file/upload/complete/:fileKey", ({ params }) => {
    const file = getFile(params.fileKey as string);
    if (!file) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "File not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      file: toApiFile(file),
    });
  }),

  // Stream endpoints - Get read token
  http.get("/file/stream/read-token/:fileKey", ({ params }) => {
    const file = getFile(params.fileKey as string);
    if (!file) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "File not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      streamToken: {
        token: `mock-read-token-${params.fileKey}`,
        downloadUrl: "https://mock-storage.example.com/download",
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      },
    });
  }),
];

// Helper function to convert MockFile to API File format
function toApiFile(mockFile: {
  fileKey: string;
  fileName: string;
  type: FileType;
  createDate: string;
  updateDate: string;
  byteSize: number;
  parentKey: string | null;
}) {
  return {
    id: parseInt(mockFile.fileKey.split("-")[1] || "1", 10),
    fileKey: mockFile.fileKey,
    fileName: mockFile.fileName,
    type: mockFile.type === "block" ? "file" : "container",
    byteSize: mockFile.byteSize,
    createdAt: mockFile.createDate,
    updatedAt: mockFile.updateDate,
    parentId: mockFile.parentKey ? parseInt(mockFile.parentKey.split("-")[1] || "1", 10) : null,
  };
}
