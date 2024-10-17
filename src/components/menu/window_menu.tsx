import { useMutation, useQueryClient } from "@tanstack/react-query";
import MenuList from "./menu_list";
import { fileQuery } from "@/api/query";
import { useWindowStore } from "@/store/window.store";
import { useCallback } from "react";
import { WindowType } from "@/interfaces/window";

export default function WindowMenu({
  windowKey,
  closeMenu,
}: {
  windowKey: string;
  closeMenu: () => void;
}) {
  // Query client
  const queryClient = useQueryClient();

  // Store actions
  const newWindow = useWindowStore((state) => state.newWindow);
  const findWindow = useWindowStore((state) => state.findWindow);

  // Mutations
  const createContainerMutation = useMutation(fileQuery.create.container);

  // Handle upload action
  const handleUpload = useCallback(() => {
    const window = findWindow(windowKey);
    if (window) {
      newWindow(window.targetKey, WindowType.Uploader, "Uploader");
      closeMenu();
    }
  }, [closeMenu, findWindow, newWindow, windowKey]);

  const handleCreateContainer = useCallback(() => {
    const window = findWindow(windowKey);
    if (window) {
      createContainerMutation
        .mutateAsync({
          parentKey: window.targetKey,
          fileName: "New Folder",
        })
        .finally(() => {
          queryClient.invalidateQueries();
          closeMenu();
        });
    }
  }, [closeMenu, createContainerMutation, findWindow, queryClient, windowKey]);

  const menuList = [
    { name: "Upload", action: handleUpload },
    { name: "Create Folder", action: handleCreateContainer },
    { name: "/", action: () => {} },
    { name: "Refresh", action: () => queryClient.invalidateQueries() },
  ];

  return <MenuList menuList={menuList} />;
}
