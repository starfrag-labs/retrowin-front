import { HttpResponse, http } from "msw";
import type { FileType } from "@/interfaces/file";
import {
  createFile,
  deleteFile,
  getChildren,
  getFile,
  getFileByPath,
  getPathFromFileKey,
  HOME_KEY,
  ROOT_KEY,
  updateFileName,
  updateFileParent,
} from "./data";

// Mock system ID
const MOCK_SYSTEM_ID = "sys-mock-123";

// Helper function to convert MockFile to Inode format
function toInode(mockFile: {
  fileKey: string;
  fileName: string;
  type: FileType;
  createDate: string;
  updateDate: string;
  byteSize: number;
  parentKey: string | null;
}) {
  // File type: directory (0o040000) or regular file (0o0100000)
  const isDirectory = mockFile.type === "container";
  const mode = isDirectory ? 0o040755 : 0o0100644;

  return {
    id: mockFile.fileKey,
    systemId: MOCK_SYSTEM_ID,
    mode,
    uid: 1000,
    gid: 1000,
    size: mockFile.byteSize,
    linkCount: 1,
    flags: 0,
    mtime: mockFile.updateDate,
    ctime: mockFile.createDate,
    createdAt: mockFile.createDate,
  };
}

export const handlers = [
  // Health check
  http.get("/health", () => {
    return HttpResponse.json({
      status: "healthy",
      version: "0.2.0",
    });
  }),

  // Auth endpoints
  http.get("/auth/login", () => {
    return HttpResponse.json({
      authorizationUrl: "https://mock-keycloak.example.com/auth",
      state: "mock-state-123",
    });
  }),

  http.post("/auth/callback", async () => {
    return HttpResponse.json({
      sessionId: "mock-session-id",
      userId: "user-123",
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    });
  }),

  http.post("/auth/logout", () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // User endpoints
  http.get("/user", () => {
    return HttpResponse.json({
      user: {
        id: "user-123",
        provider: "keycloak" as const,
        providerId: "mock-provider-id",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  http.delete("/user", () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // System endpoints
  http.get("/systems", () => {
    return HttpResponse.json({
      systems: [
        {
          id: MOCK_SYSTEM_ID,
          name: "Default System",
          description: "Mock file system",
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    });
  }),

  http.get("/systems/:systemId", ({ params }) => {
    if (params.systemId !== MOCK_SYSTEM_ID) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "System not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      system: {
        id: MOCK_SYSTEM_ID,
        name: "Default System",
        description: "Mock file system",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Filesystem endpoints - Get root directory
  http.get("/fs/:systemId/root", ({ params }) => {
    if (params.systemId !== MOCK_SYSTEM_ID) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "System not found" } },
        { status: 404 }
      );
    }

    const root = getFile(ROOT_KEY);
    if (!root) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "Root not found" } },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      inode: toInode(root),
    });
  }),

  // Filesystem endpoints - Stat path
  http.get("/fs/:systemId/stat", ({ params, request }) => {
    if (params.systemId !== MOCK_SYSTEM_ID) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "System not found" } },
        { status: 404 }
      );
    }

    const url = new URL(request.url);
    const path = url.searchParams.get("path") || "/";

    const file = getFileByPath(path);
    if (!file) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "File not found" } },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      inode: toInode(file),
    });
  }),

  // Filesystem endpoints - List directory (ls)
  http.get("/fs/:systemId/ls", ({ params, request }) => {
    if (params.systemId !== MOCK_SYSTEM_ID) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "System not found" } },
        { status: 404 }
      );
    }

    const url = new URL(request.url);
    const path = url.searchParams.get("path") || "/";

    const file = getFileByPath(path);
    if (!file) {
      return HttpResponse.json({
        entries: [],
      });
    }

    const children = getChildren(file.fileKey);

    return HttpResponse.json({
      entries: children.map((child) => ({
        name: child.fileName,
        inodeId: child.fileKey,
        fileType: child.type === "container" ? 0o040000 : 0o0100000,
      })),
    });
  }),

  // Filesystem endpoints - Create directory
  http.post("/fs/:systemId/mkdir", async ({ params, request }) => {
    if (params.systemId !== MOCK_SYSTEM_ID) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "System not found" } },
        { status: 404 }
      );
    }

    const body = (await request.json()) as { path?: string; mode?: number };
    const { path: requestedPath } = body;

    if (!requestedPath) {
      return HttpResponse.json(
        { error: { type: "bad_request", message: "path is required" } },
        { status: 400 }
      );
    }

    // Extract parent path and new directory name
    const parts = requestedPath.split("/").filter(Boolean);
    const dirName = parts.pop() || "New Folder";
    const parentPath = parts.length > 0 ? `/${parts.join("/")}` : "/";

    // Find parent
    const parent = getFileByPath(parentPath);
    if (!parent) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "Parent not found" } },
        { status: 404 }
      );
    }

    const newFile = createFile(parent.fileKey, dirName, "container" as FileType);
    if (!newFile) {
      return HttpResponse.json(
        { error: { type: "internal_error", message: "Failed to create directory" } },
        { status: 500 }
      );
    }

    return HttpResponse.json(
      {
        inode: toInode(newFile),
      },
      { status: 201 }
    );
  }),

  // Filesystem endpoints - Rename (same directory)
  http.post("/fs/:systemId/rename", async ({ params, request }) => {
    if (params.systemId !== MOCK_SYSTEM_ID) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "System not found" } },
        { status: 404 }
      );
    }

    const body = (await request.json()) as { path?: string; newName?: string };
    const { path: fromPath, newName } = body;

    if (!fromPath || !newName) {
      return HttpResponse.json(
        { error: { type: "bad_request", message: "path and newName are required" } },
        { status: 400 }
      );
    }

    const sourceFile = getFileByPath(fromPath);
    if (!sourceFile) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "Source file not found" } },
        { status: 404 }
      );
    }

    // Update file name (keeps same parent)
    const updated = updateFileName(sourceFile.fileKey, newName);
    if (!updated) {
      return HttpResponse.json(
        { error: { type: "internal_error", message: "Failed to rename file" } },
        { status: 500 }
      );
    }

    return HttpResponse.json({
      inode: toInode(updated),
    });
  }),

  // Filesystem endpoints - Move (mv)
  http.post("/fs/:systemId/mv", async ({ params, request }) => {
    if (params.systemId !== MOCK_SYSTEM_ID) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "System not found" } },
        { status: 404 }
      );
    }

    const body = (await request.json()) as { path?: string; destination?: string };
    const { path: fromPath, destination } = body;

    if (!fromPath || !destination) {
      return HttpResponse.json(
        { error: { type: "bad_request", message: "path and destination are required" } },
        { status: 400 }
      );
    }

    const sourceFile = getFileByPath(fromPath);
    if (!sourceFile) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "Source file not found" } },
        { status: 404 }
      );
    }

    // Extract target parent and new name from destination
    const destParts = destination.split("/").filter(Boolean);
    const newName = destParts.pop() || sourceFile.fileName;
    const targetParentPath = destParts.length > 0 ? `/${destParts.join("/")}` : "/";

    // Check if destination is a directory or a full path
    const targetParentFile = getFileByPath(destination);
    let targetParent = targetParentFile;

    if (!targetParentFile) {
      // Not a direct directory match, check if it's a parent path
      const possibleParent = getFileByPath(targetParentPath);
      if (!possibleParent) {
        return HttpResponse.json(
          { error: { type: "not_found", message: "Target parent not found" } },
          { status: 404 }
        );
      }
      targetParent = possibleParent;
    }

    // Ensure targetParent is not null
    if (!targetParent) {
      return HttpResponse.json(
        { error: { type: "internal_error", message: "Failed to determine target parent" } },
        { status: 500 }
      );
    }

    // Update file parent and name
    const updated = updateFileParent(sourceFile.fileKey, targetParent.fileKey);
    if (updated) {
      updateFileName(updated.fileKey, newName);
    }

    return HttpResponse.json({
      inode: toInode(updated || sourceFile),
    });
  }),

  // Filesystem endpoints - Create symlink (ln)
  http.post("/fs/:systemId/ln", async ({ params, request }) => {
    if (params.systemId !== MOCK_SYSTEM_ID) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "System not found" } },
        { status: 404 }
      );
    }

    const body = (await request.json()) as { target?: string; linkPath?: string };
    const { target, linkPath } = body;

    if (!target || !linkPath) {
      return HttpResponse.json(
        { error: { type: "bad_request", message: "target and linkPath are required" } },
        { status: 400 }
      );
    }

    const targetFile = getFileByPath(target);
    if (!targetFile) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "Target not found" } },
        { status: 404 }
      );
    }

    // Extract parent path and link name
    const parts = linkPath.split("/").filter(Boolean);
    const linkName = parts.pop() || "link";
    const parentPath = parts.length > 0 ? `/${parts.join("/")}` : "/";

    const parent = getFileByPath(parentPath);
    if (!parent) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "Parent not found" } },
        { status: 404 }
      );
    }

    // Create symlink file
    const newLink = createFile(parent.fileKey, linkName, "link" as FileType);
    if (!newLink) {
      return HttpResponse.json(
        { error: { type: "internal_error", message: "Failed to create symlink" } },
        { status: 500 }
      );
    }

    return HttpResponse.json(
      {
        inode: toInode(newLink),
      },
      { status: 201 }
    );
  }),

  // Filesystem endpoints - Delete (unlink)
  http.delete("/fs/:systemId/unlink", ({ params, request }) => {
    if (params.systemId !== MOCK_SYSTEM_ID) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "System not found" } },
        { status: 404 }
      );
    }

    const url = new URL(request.url);
    const path = url.searchParams.get("path") || "";

    const file = getFileByPath(path);
    if (!file) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "File not found" } },
        { status: 404 }
      );
    }

    deleteFile(file.fileKey);

    return new HttpResponse(null, { status: 204 });
  }),

  // Upload endpoints - Initiate upload
  http.post("/fs/:systemId/upload/initiate", async ({ params, request }) => {
    if (params.systemId !== MOCK_SYSTEM_ID) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "System not found" } },
        { status: 404 }
      );
    }

    const body = (await request.json()) as { path?: string; size?: number };
    const { path: requestedPath } = body;

    if (!requestedPath) {
      return HttpResponse.json(
        { error: { type: "bad_request", message: "path is required" } },
        { status: 400 }
      );
    }

    const objectId = `obj-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    return HttpResponse.json(
      {
        uploadSession: {
          objectId,
          uploadUrl: "https://mock-storage.example.com/upload",
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  // Upload endpoints - Complete upload
  http.post("/fs/:systemId/upload/complete", async ({ params, request }) => {
    if (params.systemId !== MOCK_SYSTEM_ID) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "System not found" } },
        { status: 404 }
      );
    }

    const body = (await request.json()) as { objectId?: string; path?: string };
    const { path: requestedPath, objectId } = body;

    if (!requestedPath || !objectId) {
      return HttpResponse.json(
        { error: { type: "bad_request", message: "objectId and path are required" } },
        { status: 400 }
      );
    }

    // Extract parent path and file name
    const parts = requestedPath.split("/").filter(Boolean);
    const fileName = parts.pop() || "uploaded-file";
    const parentPath = parts.length > 0 ? `/${parts.join("/")}` : "/";

    // Find parent
    const parent = getFileByPath(parentPath);
    if (!parent) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "Parent not found" } },
        { status: 404 }
      );
    }

    // Create a new file entry
    const newFile = createFile(
      parent.fileKey,
      fileName,
      "block" as FileType
    );

    if (!newFile) {
      return HttpResponse.json(
        { error: { type: "internal_error", message: "Failed to create file" } },
        { status: 500 }
      );
    }

    return HttpResponse.json(
      {
        inode: toInode(newFile),
      },
      { status: 201 }
    );
  }),

  // Download endpoints - Get download URL
  http.get("/fs/:systemId/download", ({ params, request }) => {
    if (params.systemId !== MOCK_SYSTEM_ID) {
      return HttpResponse.json(
        { error: { type: "not_found", message: "System not found" } },
        { status: 404 }
      );
    }

    const url = new URL(request.url);
    const path = url.searchParams.get("path") || "/";

    return HttpResponse.json({
      downloadUrl: {
        downloadUrl: "https://mock-storage.example.com/download",
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      },
    });
  }),
];
