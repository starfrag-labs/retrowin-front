import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MenuList from "./menu_list";
import { fileQuery } from "@/api/query";
import { useWindowStore } from "@/store/window.store";
import { useCallback } from "react";
import { WindowType } from "@/interfaces/window";

export default function BackgroundMenu({
  closeMenu,
}: {
  closeMenu: () => void;
}) {
  // Query client
  const queryClient = useQueryClient();

  // Queries
  const rootKeyQuery = useQuery(fileQuery.read.root);
  const createContainerMutation = useMutation(fileQuery.create.container);

  // Store actions
  const newWindow = useWindowStore((state) => state.newWindow);

  const handleUpload = useCallback(() => {
    if (rootKeyQuery.isSuccess && rootKeyQuery.data) {
      newWindow(
        rootKeyQuery.data.data.fileKey,
        WindowType.Uploader,
        "Uploader",
      );
      closeMenu();
    }
  }, [newWindow, rootKeyQuery, closeMenu]);

  const handleCreateFolder = useCallback(async () => {
    if (rootKeyQuery.isSuccess && rootKeyQuery.data) {
      closeMenu();
      createContainerMutation
        .mutateAsync({
          parentKey: rootKeyQuery.data.data.fileKey,
          fileName: "New_Folder",
        })
        .finally(() => {
          queryClient.invalidateQueries({
            queryKey: ["file", rootKeyQuery.data.data.fileKey],
          });
        });
    }
  }, [
    rootKeyQuery.isSuccess,
    rootKeyQuery.data,
    createContainerMutation,
    queryClient,
    closeMenu,
  ]);

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
