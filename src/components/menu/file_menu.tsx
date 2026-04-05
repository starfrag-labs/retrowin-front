import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useUnlink } from "@/api/generated";
import { FileType } from "@/interfaces/file";
import { WindowType } from "@/interfaces/window";
import { useFileStore } from "@/store/file.store";
import { useWindowStore } from "@/store/window.store";
import { ContentTypes, getContentTypes } from "@/utils/content_types";
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
  const _queryClient = useQueryClient();

  // Get system ID from window store
  const windows = useWindowStore((state) => state.windows);
  const currentWindow = windows.find((w) => w.key === windowKey);
  const systemId = currentWindow?.systemId || "";

  // Mutations
  const _unlinkMutation = useUnlink();

  // Store actions
  const newWindow = useWindowStore((state) => state.newWindow);
  const _getSelectedFileKeys = useFileStore(
    (state) => state.getSelectedFileKeys
  );
  const setRenamingFile = useFileStore((state) => state.setRenamingFile);

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

  // Delete file actions (TODO: Implement with proper systemId)
  const handleMoveToTrash = useCallback(() => {
    closeMenu();
    // TODO: Implement move to trash
    console.warn("Move to trash not implemented in new API");
    /*
    const selectedFileKeys = getSelectedFileKeys();
    Promise.all(
      selectedFileKeys.map((filePath) =>
        unlinkMutation.mutateAsync({
          systemId,
          data: { path: filePath },
        })
      )
    ).finally(() => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "readDir",
      });
    });
    */
  }, [closeMenu]);

  const handlePermanentDelete = useCallback(() => {
    closeMenu();
    // TODO: Implement permanent delete
    console.warn("Permanent delete not implemented in new API");
  }, [closeMenu]);

  const handleEmptyTrash = useCallback(async () => {
    closeMenu();
    // TODO: Implement empty trash
    console.warn("Empty trash not implemented in new API");
    /*
    const files = await useReadDir()(
      systemId,
      { path },
      { fetch: { credentials: "include" } }
    );
    if (files.data && "entries" in files.data) {
      Promise.all(
        files.data.entries.map((entry) =>
          unlinkMutation.mutateAsync({
            systemId,
            data: { path: `${path}/${entry.name}` },
          })
        )
      ).then(() => {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "readDir",
        });
      });
    }
    */
  }, [closeMenu]);

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
