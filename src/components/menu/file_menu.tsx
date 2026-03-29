import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useDeleteFile } from "@/api/generated";
import { getStreamToken, getFileChildren } from "@/api/generated";
import { FileType } from "@/interfaces/file";
import { WindowType } from "@/interfaces/window";
import { useFileStore } from "@/store/file.store";
import { useWindowStore } from "@/store/window.store";
import { ContentTypes, getContentTypes } from "@/utils/content_types";
import MenuList from "./menu_list";

export default function FileMenu({
  fileKey,
  fileType,
  fileName,
  windowKey,
  parentWindowType,
  closeMenu,
}: {
  fileKey: string;
  fileType: FileType;
  fileName: string;
  windowKey: string;
  parentWindowType: WindowType | null;
  closeMenu: () => void;
}) {
  // Query client
  const queryClient = useQueryClient();

  // Mutations
  const deleteFileMutation = useDeleteFile();

  // Store actions
  const newWindow = useWindowStore((state) => state.newWindow);
  const getSelectedFileKeys = useFileStore(
    (state) => state.getSelectedFileKeys
  );
  const setRenamingFile = useFileStore((state) => state.setRenamingFile);

  const openFile = useCallback(
    async (
      fileType: Omit<FileType, FileType.Link>,
      fileName: string,
      fileKey: string
    ) => {
      let windowType: WindowType;
      switch (fileType) {
        case FileType.Container:
        case FileType.Root:
        case FileType.Home:
        case FileType.Trash:
          windowType = WindowType.Navigator;
          break;
        case FileType.Block: {
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
        targetKey: fileKey,
        type: windowType,
        title: fileName,
      });
    },
    [newWindow]
  );

  // Open file action
  const handleOpen = useCallback(async () => {
    closeMenu();
    openFile(fileType, fileName, fileKey);
  }, [
    closeMenu,
    fileKey,
    fileName,
    fileType,
    openFile,
  ]);

  // Update file actions
  const handleRename = useCallback(() => {
    closeMenu();
    setRenamingFile({ fileKey, windowKey });
  }, [closeMenu, fileKey, setRenamingFile, windowKey]);

  // Download file actions
  const handleDownload = useCallback(async () => {
    closeMenu();
    // Get stream token for download
    const tokenResponse = await getStreamToken(fileKey, { credentials: "include" });
    if (tokenResponse.data && "streamToken" in tokenResponse.data) {
      const a = document.createElement("a");
      a.href = tokenResponse.data.streamToken.downloadUrl;
      a.download = fileName;
      a.click();
    }
  }, [closeMenu, fileKey, fileName]);

  // Delete file actions
  const handleMoveToTrash = useCallback(() => {
    closeMenu();
    const selectedFileKeys = getSelectedFileKeys();
    Promise.all(
      selectedFileKeys.map((fileKey) =>
        deleteFileMutation.mutateAsync({ fileKey, params: { permanent: false } })
      )
    ).finally(() => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "file",
      });
    });
  }, [closeMenu, getSelectedFileKeys, deleteFileMutation, queryClient]);

  const handlePermanentDelete = useCallback(() => {
    closeMenu();
    const selectedFileKeys = getSelectedFileKeys();
    Promise.all(
      selectedFileKeys.map((fileKey) =>
        deleteFileMutation.mutateAsync({ fileKey, params: { permanent: true } })
      )
    ).finally(() => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "file",
      });
    });
  }, [closeMenu, getSelectedFileKeys, deleteFileMutation, queryClient]);

  const handleEmptyTrash = useCallback(async () => {
    closeMenu();
    const files = await getFileChildren(fileKey, { credentials: "include" });
    if (files.data && "files" in files.data) {
      Promise.all(
        files.data.files.map((file) =>
          deleteFileMutation.mutateAsync({ fileKey: file.fileKey, params: { permanent: true } })
        )
      ).then(() => {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "file",
        });
      });
    }
  }, [closeMenu, fileKey, deleteFileMutation, queryClient]);

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
    case FileType.Block:
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
