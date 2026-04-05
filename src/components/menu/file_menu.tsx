import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useUnlink, useMv, ls } from "@/api/generated";
import { FileType } from "@/interfaces/file";
import { WindowType } from "@/interfaces/window";
import { useFileStore } from "@/store/file.store";
import { useWindowStore } from "@/store/window.store";
import { ContentTypes, getContentTypes } from "@/utils/content_types";
import { isFsQuery } from "@/utils/query_keys";
import MenuList from "./menu_list";

export default function FileMenu({
  path,
  fileType,
  fileName,
  windowKey,
  parentWindowType,
  closeMenu,
}: {
  path: string;
  fileType: FileType;
  fileName: string;
  windowKey: string;
  parentWindowType: WindowType | null;
  closeMenu: () => void;
}) {
  // Query client
  const queryClient = useQueryClient();

  // Get system ID from window store
  const windows = useWindowStore((state) => state.windows);
  const currentWindow = windows.find((w) => w.key === windowKey);
  const systemId = currentWindow?.systemId || "";

  // Mutations
  const unlinkMutation = useUnlink();
  const mvMutation = useMv();

  // Store actions
  const newWindow = useWindowStore((state) => state.newWindow);
  const getSelectedFileKeys = useFileStore(
    (state) => state.getSelectedFileKeys
  );
  const setRenamingFile = useFileStore((state) => state.setRenamingFile);

  // Get all selected file paths (includes the right-clicked file)
  const getTargetPaths = useCallback(() => {
    const selectedKeys = getSelectedFileKeys();
    // Include the right-clicked file even if not in selection
    if (!selectedKeys.includes(path)) {
      return [path];
    }
    return selectedKeys;
  }, [getSelectedFileKeys, path]);

  const openFile = useCallback(
    async (
      fileType: Omit<FileType, FileType.Link>,
      fileName: string,
      path: string
    ) => {
      let windowType: WindowType;
      switch (fileType) {
        case FileType.Container:
        case FileType.Root:
        case FileType.Home:
        case FileType.Trash:
          windowType = WindowType.Navigator;
          break;
        case FileType.Object: {
          const contentType = getContentTypes(fileName);
          switch (contentType) {
            case ContentTypes.Image:
              windowType = WindowType.Image;
              break;
            case ContentTypes.Video:
              windowType = WindowType.Video;
              break;
            case ContentTypes.Audio:
              windowType = WindowType.Audio;
              break;
            default:
              windowType = WindowType.Other;
              break;
          }
          break;
        }
        case FileType.Upload:
          windowType = WindowType.Uploader;
          break;
        default:
          windowType = WindowType.Other;
          break;
      }
      newWindow({
        targetKey: path,
        type: windowType,
        title: fileName,
        systemId,
      });
    },
    [newWindow, systemId]
  );

  // Open file action
  const handleOpen = useCallback(async () => {
    closeMenu();
    openFile(fileType, fileName, path);
  }, [closeMenu, path, fileName, fileType, openFile]);

  // Update file actions
  const handleRename = useCallback(() => {
    closeMenu();
    setRenamingFile({ fileKey: path, windowKey });
  }, [closeMenu, path, windowKey, setRenamingFile]);

  // Download file actions
  const handleDownload = useCallback(async () => {
    closeMenu();
    // TODO: Implement download with proper API call
    console.warn("Download not fully implemented in new API");
    // Need to call getDownloadUrl API function directly
  }, [closeMenu]);

  // Move to trash action
  const handleMoveToTrash = useCallback(async () => {
    closeMenu();
    try {
      const paths = getTargetPaths();
      await Promise.all(
        paths.map((p) =>
          mvMutation.mutateAsync({
            systemId,
            data: { path: p, destination: "/home/.trash" },
          })
        )
      );
      queryClient.invalidateQueries({ predicate: isFsQuery });
    } catch (error) {
      console.error("[FileMenu] Move to trash failed:", error);
    }
  }, [closeMenu, getTargetPaths, systemId, mvMutation, queryClient]);

  const handlePermanentDelete = useCallback(async () => {
    closeMenu();
    try {
      const paths = getTargetPaths();
      await Promise.all(
        paths.map((p) =>
          unlinkMutation.mutateAsync({
            systemId,
            params: { path: p },
          })
        )
      );
      queryClient.invalidateQueries({ predicate: isFsQuery });
    } catch (error) {
      console.error("[FileMenu] Permanent delete failed:", error);
    }
  }, [closeMenu, getTargetPaths, systemId, unlinkMutation, queryClient]);

  const handleEmptyTrash = useCallback(async () => {
    closeMenu();
    try {
      const readDirResult = await ls(
        systemId,
        { path },
        { credentials: "include" }
      );
      if (readDirResult.data && "entries" in readDirResult.data) {
        await Promise.all(
          readDirResult.data.entries.map((entry) =>
            unlinkMutation.mutateAsync({
              systemId,
              params: { path: `${path === "/" ? "" : path}/${entry.name}` },
            })
          )
        );
        queryClient.invalidateQueries({ predicate: isFsQuery });
      }
    } catch (error) {
      console.error("[FileMenu] Empty trash failed:", error);
    }
  }, [closeMenu, path, systemId, unlinkMutation, queryClient]);

  // Delete file actions based on parent window type
  const deleteMenu =
    parentWindowType === WindowType.Trash
      ? { name: "Permanent Delete", action: handlePermanentDelete }
      : { name: "Move to Trash", action: handleMoveToTrash };

  switch (fileType) {
    case FileType.Container:
    case FileType.Root:
    case FileType.Home:
      return (
        <MenuList
          menuList={[
            { name: "Open", action: handleOpen },
            { name: "Rename", action: handleRename },
            { name: "/", action: () => {} },
            deleteMenu,
          ]}
        />
      );
    case FileType.Object:
      return (
        <MenuList
          menuList={[
            { name: "Open", action: handleOpen },
            { name: "Download", action: handleDownload },
            { name: "Rename", action: handleRename },
            { name: "/", action: () => {} },
            deleteMenu,
          ]}
        />
      );
    case FileType.Regular:
      return (
        <MenuList
          menuList={[
            { name: "Rename", action: handleRename },
            { name: "/", action: () => {} },
            deleteMenu,
          ]}
        />
      );
    case FileType.Link:
      return (
        <MenuList
          menuList={[
            { name: "Open", action: handleOpen },
            { name: "Rename", action: handleRename },
            { name: "/", action: () => {} },
            deleteMenu,
          ]}
        />
      );
    case FileType.Upload:
      return <MenuList menuList={[{ name: "Open", action: handleOpen }]} />;
    case FileType.Trash:
      return (
        <MenuList
          menuList={[{ name: "Empty Trash", action: handleEmptyTrash }]}
        />
      );
    default:
      return null;
  }
}
