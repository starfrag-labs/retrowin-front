import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useCreateFile } from "@/api/generated";
import { WindowType } from "@/interfaces/window";
import { useWindowStore } from "@/store/window.store";
import MenuList from "./menu_list";

export default function BackgroundMenu({
  backgroundFileKey,
  closeMenu,
}: {
  backgroundFileKey: string;
  closeMenu: () => void;
}) {
  // Query client
  const queryClient = useQueryClient();

  // Mutations
  const createContainerMutation = useCreateFile();

  // Store actions
  const newWindow = useWindowStore((state) => state.newWindow);

  const handleUpload = useCallback(() => {
    if (backgroundFileKey) {
      newWindow({
        targetKey: backgroundFileKey,
        type: WindowType.Uploader,
        title: "Uploader",
      });
      closeMenu();
    }
  }, [backgroundFileKey, newWindow, closeMenu]);

  const handleCreateFolder = useCallback(async () => {
    if (!backgroundFileKey) return;
    closeMenu();
    const result = await createContainerMutation.mutateAsync({
      data: { type: "container", fileName: "New Folder", parentKey: backgroundFileKey },
    });
    if (result.data && "file" in result.data) {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "file",
      });
    }
  }, [backgroundFileKey, closeMenu, createContainerMutation, queryClient]);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "file",
    });
    closeMenu();
  }, [queryClient, closeMenu]);

  const menuList = [
    { name: "Upload", action: handleUpload },
    { name: "Create Folder", action: handleCreateFolder },
    { name: "/", action: () => {} },
    { name: "Refresh", action: handleRefresh },
  ];

  return <MenuList menuList={menuList} />;
}
