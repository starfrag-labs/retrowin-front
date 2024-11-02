import { useMutation, useQueryClient } from "@tanstack/react-query";
import MenuList from "./menu_list";
import { fileQuery } from "@/api/query";
import { useWindowStore } from "@/store/window.store";
import { useCallback } from "react";
import { WindowType } from "@/interfaces/window";

export default function WindowMenu({
  targetFileKey,
  closeMenu,
}: {
  targetFileKey: string;
  closeMenu: () => void;
}) {
  // Query client
  const queryClient = useQueryClient();

  // Store actions
  const newWindow = useWindowStore((state) => state.newWindow);

  // Mutations
  const createContainerMutation = useMutation(fileQuery.create.container);

  // Handle upload action
  const handleUpload = useCallback(() => {
    newWindow({
      targetKey: targetFileKey,
      type: WindowType.Uploader,
      title: "Uploader",
    });
    closeMenu();
  }, [closeMenu, newWindow, targetFileKey]);

  const handleCreateContainer = useCallback(() => {
    createContainerMutation
      .mutateAsync({
        parentKey: targetFileKey,
        fileName: "New Folder",
      })
      .finally(() => {
        queryClient.invalidateQueries({
          queryKey: ["file", targetFileKey],
        });
        closeMenu();
      });
  }, [closeMenu, createContainerMutation, queryClient, targetFileKey]);

  const menuList = [
    { name: "Upload", action: handleUpload },
    { name: "Create Folder", action: handleCreateContainer },
    { name: "/", action: () => {} },
    { name: "Refresh", action: () => queryClient.invalidateQueries() },
  ];

  return <MenuList menuList={menuList} />;
}
