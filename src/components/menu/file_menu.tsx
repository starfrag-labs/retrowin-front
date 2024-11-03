import { useMutation, useQueryClient } from "@tanstack/react-query";
import MenuList from "./menu_list";
import { useWindowStore } from "@/store/window.store";
import { fileQuery, storageQuery } from "@/api/query";
import { useCallback } from "react";
import { WindowType } from "@/interfaces/window";
import { FileType } from "@/interfaces/file";
import { useFileStore } from "@/store/file.store";
import { ContentTypes, getContentTypes } from "@/utils/content_types";
import { url } from "@/api/fetch";

export default function FileMenu({
  fileKey,
  fileType,
  fileName,
  windowKey,
  closeMenu,
}: {
  fileKey: string;
  fileType: FileType;
  fileName: string;
  windowKey: string;
  closeMenu: () => void;
}) {
  // Query client
  const queryClient = useQueryClient();
  // Queries

  // Mutations
  const moveToTrashMutation = useMutation(fileQuery.update.trash);
  const permanentDeleteMutation = useMutation(fileQuery.delete.permanent);

  // Store actions
  const newWindow = useWindowStore((state) => state.newWindow);
  const getSelectedFileKeys = useFileStore(
    (state) => state.getSelectedFileKeys,
  );
  const setRenamingFile = useFileStore((state) => state.setRenamingFile);

  // Open file action
  const handleOpen = useCallback(() => {
    let windowType: WindowType;
    switch (fileType) {
      case FileType.Container:
        windowType = WindowType.Navigator;
        break;
      case FileType.Block:
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
      default:
        windowType = WindowType.Document;
        break;
    }
    newWindow({
      targetKey: fileKey,
      type: windowType,
      title: fileName,
    });
    closeMenu();
  }, [closeMenu, fileKey, fileName, fileType, newWindow]);

  // Update file actions
  const handleRename = useCallback(() => {
    closeMenu();
    setRenamingFile({ fileKey, windowKey });
  }, [closeMenu, fileKey, setRenamingFile, windowKey]);

  // Download file actions
  const handleDownload = useCallback(async () => {
    closeMenu();
    await queryClient.fetchQuery(storageQuery.session.read(fileKey));

    const downloadUrl = `${url.storage.file.readWithName(fileKey, fileName)}`;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = fileName;
    a.click();
  }, [closeMenu, fileKey, fileName, queryClient]);

  // Delete file actions
  const handleMoveToTrash = useCallback(() => {
    closeMenu();
    const selectedFileKeys = getSelectedFileKeys();
    Promise.all(
      selectedFileKeys.map((fileKey) =>
        moveToTrashMutation.mutateAsync({ fileKey }),
      ),
    ).finally(() => {
      queryClient.invalidateQueries({
        queryKey: ["file"],
      });
    });
  }, [closeMenu, getSelectedFileKeys, moveToTrashMutation, queryClient]);

  const handlePermanentDelete = useCallback(() => {
    closeMenu();
    const selectedFileKeys = getSelectedFileKeys();
    Promise.all(
      selectedFileKeys.map((fileKey) =>
        permanentDeleteMutation.mutateAsync({ fileKey }),
      ),
    ).finally(() => {
      queryClient.invalidateQueries({
        queryKey: ["file"],
      });
    });
  }, [closeMenu, getSelectedFileKeys, permanentDeleteMutation, queryClient]);

  const menuList = [
    { name: "Open", action: handleOpen },
    { name: "Download", action: handleDownload },
    { name: "Rename", action: handleRename },
    { name: "/", action: () => {} },
    { name: "Move to Trash", action: handleMoveToTrash },
    { name: "Permanent Delete", action: handlePermanentDelete },
  ];

  return <MenuList menuList={menuList} />;
}
