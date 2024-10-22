import { useMutation, useQueryClient } from "@tanstack/react-query";
import MenuList from "./menu_list";
import { useWindowStore } from "@/store/window.store";
import { fileQuery } from "@/api/query";
import { useCallback } from "react";
import { WindowType } from "@/interfaces/window";
import { FileType } from "@/interfaces/file";

export default function FileMenu({
  fileKey,
  fileType,
  fileName,
  closeMenu,
}: {
  fileKey: string;
  fileType: FileType;
  fileName: string;
  closeMenu: () => void;
}) {
  // Query client
  const queryClient = useQueryClient();

  // Mutations
  const moveToTrashMutation = useMutation(fileQuery.delete.trash);
  const permanentDeleteMutation = useMutation(fileQuery.delete.permanent);

  // Store actions
  const newWindow = useWindowStore((state) => state.newWindow);

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
    newWindow(fileKey, windowType, fileName);
    closeMenu();
  }, [closeMenu, fileKey, fileName, fileType, newWindow]);

  const handleMoveToTrash = useCallback(() => {
    closeMenu();
    moveToTrashMutation.mutateAsync({ fileKey }).finally(() => {
      queryClient.invalidateQueries({
        queryKey: ["file"],
      });
    });
  }, [closeMenu, fileKey, moveToTrashMutation, queryClient]);

  const handlePermanentDelete = useCallback(() => {
    closeMenu();
    permanentDeleteMutation.mutateAsync({ fileKey }).finally(() => {
      queryClient.invalidateQueries({
        queryKey: ["file"],
      });
    });
  }, [closeMenu, fileKey, permanentDeleteMutation, queryClient]);

  const menuList = [
    { name: "Open", action: handleOpen },
    { name: "/", action: () => {} },
    { name: "Move to Trash", action: handleMoveToTrash },
    { name: "Permanent Delete", action: handlePermanentDelete },
  ];

  return <MenuList menuList={menuList} />;
}
