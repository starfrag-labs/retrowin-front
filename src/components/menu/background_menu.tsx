import { useMutation, useQueryClient } from "@tanstack/react-query";
import MenuList from "./menu_list";
import { fileQuery } from "@/api/query";
import { useWindowStore } from "@/store/window.store";
import { useCallback } from "react";
import { WindowType } from "@/interfaces/window";

export default function BackgroundMenu({
  backgroundFileKey,
  closeMenu,
}: {
  backgroundFileKey: string;
  closeMenu: () => void;
}) {
  // Query client
  const queryClient = useQueryClient();

  // Queries
  const createContainerMutation = useMutation(fileQuery.create.container);

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
    if (backgroundFileKey) {
      closeMenu();
      createContainerMutation
        .mutateAsync({
          parentKey: backgroundFileKey,
          fileName: "New_Folder",
        })
        .finally(() => {
          queryClient.invalidateQueries({
            queryKey: ["file", backgroundFileKey],
          });
        });
    }
  }, [backgroundFileKey, closeMenu, createContainerMutation, queryClient]);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries();
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
