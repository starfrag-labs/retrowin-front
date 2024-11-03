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

  const openFile = useCallback(
    async (
      fileType: Omit<FileType, FileType.Link>,
      fileName: string,
      fileKey: string,
    ) => {
      let windowType: WindowType;
      switch (fileType) {
        case FileType.Container:
        case FileType.Root:
        case FileType.Home:
        case FileType.Trash:
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
    [newWindow],
  );

  // Open file action
  const handleOpen = useCallback(async () => {
    closeMenu();
    if (fileType === FileType.Link) {
      const linkTarget = await queryClient.fetchQuery(
        fileQuery.read.linkTarget(fileKey),
      );
      if (linkTarget.status === 200 && linkTarget.data) {
        openFile(linkTarget.data.type, fileName, linkTarget.data.fileKey);
      }
    } else {
      openFile(fileType, fileName, fileKey);
    }
  }, [closeMenu, fileKey, fileName, fileType, openFile, queryClient]);

  // Open file location action
  const handleOpenLinkTargetLocation = useCallback(async () => {
    closeMenu();
    const linkTarget = await queryClient.fetchQuery(
      fileQuery.read.linkTarget(fileKey),
    );
    if (linkTarget.status === 200 && linkTarget.data) {
      const parent = await queryClient.fetchQuery(
        fileQuery.read.parent(linkTarget.data.fileKey),
      );
      if (parent.status === 200 && parent.data) {
        newWindow({
          targetKey: parent.data.fileKey,
          type: WindowType.Navigator,
          title: parent.data.fileName,
        });
      }
    }
  }, [closeMenu, fileKey, newWindow, queryClient]);

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

  if (fileType === FileType.Container) {
    return (
      <MenuList
        menuList={[
          { name: "Open", action: handleOpen },
          { name: "Rename", action: handleRename },
          { name: "/", action: () => {} },
          { name: "Move to Trash", action: handleMoveToTrash },
        ]}
      />
    );
  } else if (fileType === FileType.Block) {
    return (
      <MenuList
        menuList={[
          { name: "Open", action: handleOpen },
          { name: "Download", action: handleDownload },
          { name: "Rename", action: handleRename },
          { name: "/", action: () => {} },
          { name: "Move to Trash", action: handleMoveToTrash },
        ]}
      />
    );
  } else if (fileType === FileType.Link) {
    return (
      <MenuList
        menuList={[
          { name: "Open", action: handleOpen },
          {
            name: "Open Link Target Location",
            action: handleOpenLinkTargetLocation,
          },
          { name: "Rename", action: handleRename },
          { name: "/", action: () => {} },
          { name: "Move to Trash", action: handleMoveToTrash },
        ]}
      />
    );
  } else if (fileType === FileType.Upload) {
    return <MenuList menuList={[{ name: "Open", action: handleOpen }]} />;
  }

  return <MenuList menuList={menuList} />;
}
