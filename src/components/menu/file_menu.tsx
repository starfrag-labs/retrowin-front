import { useMutation, useQueryClient } from "@tanstack/react-query";
import MenuList from "./menu_list";
import { useWindowStore } from "@/store/window.store";
import { fileQuery } from "@/api/query";
import { useCallback } from "react";
import { WindowType } from "@/interfaces/window";
import { FileType } from "@/interfaces/file";
import { useFileStore } from "@/store/file.store";

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

  // Mutations
  const moveToTrashMutation = useMutation(fileQuery.delete.trash);
  const permanentDeleteMutation = useMutation(fileQuery.delete.permanent);

  // Store actions
  const newWindow = useWindowStore((state) => state.newWindow);
  const getSelectedFileKeys = useFileStore(
    (state) => state.getSelectedFileKeys,
  );
  const setRenamingFile = useFileStore((state) => state.setRenamingFile);

  const handleOpen = useCallback(() => {
    let windowType: WindowType;
    switch (fileType) {
      case "container":
        windowType = WindowType.Navigator;
        break;
      case "block":
        windowType = WindowType.Document;
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

  const handleRename = useCallback(() => {
    closeMenu();
    setRenamingFile({ fileKey, windowKey });
  }, [closeMenu, fileKey, setRenamingFile, windowKey]);

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
    { name: "Rename", action: handleRename },
    { name: "/", action: () => {} },
    { name: "Move to Trash", action: handleMoveToTrash },
    { name: "Permanent Delete", action: handlePermanentDelete },
  ];

  return <MenuList menuList={menuList} />;
}
