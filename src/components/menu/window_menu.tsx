import { useMutation, useQueryClient } from "@tanstack/react-query";
import MenuList from "./menu_list";
import { fileQuery } from "@/api/query";
import { useWindowStore } from "@/store/window.store";
import { useCallback } from "react";
import { WindowType } from "@/interfaces/window";

export default function WindowMenu({
  targetFileKey,
  windowType,
  closeMenu,
}: {
  targetFileKey: string;
  windowType: WindowType | null;
  closeMenu: () => void;
}) {
  // Query client
  const queryClient = useQueryClient();

  // Store actions
  const newWindow = useWindowStore((state) => state.newWindow);

  // Mutations
  const createContainerMutation = useMutation(fileQuery.create.container);
  const deleteFilePermanentMutation = useMutation(fileQuery.delete.permanent);

  // Handle upload action
  const handleUpload = useCallback(() => {
    newWindow({
      targetKey: targetFileKey,
      type: WindowType.Uploader,
      title: "Uploader",
    });
    closeMenu();
  }, [closeMenu, newWindow, targetFileKey]);

  const handleCreateContainer = useCallback(async () => {
    createContainerMutation
      .mutateAsync({
        parentKey: targetFileKey,
        fileName: "New_Folder",
      })
      .finally(() => {
        queryClient.invalidateQueries({
          queryKey: ["file", targetFileKey],
        });
        closeMenu();
      });
  }, [closeMenu, createContainerMutation, queryClient, targetFileKey]);

  const handleEmptyTrash = useCallback(async () => {
    closeMenu();
    const files = await queryClient.fetchQuery(
      fileQuery.read.children(targetFileKey),
    );
    Promise.all(
      files.data.map((file) =>
        deleteFilePermanentMutation.mutateAsync({ fileKey: file.fileKey }),
      ),
    ).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["file", targetFileKey],
      });
    });
  }, [closeMenu, deleteFilePermanentMutation, queryClient, targetFileKey]);

  const handleRefresh = useCallback(async () => {
    queryClient.invalidateQueries();
    closeMenu();
  }, [closeMenu, queryClient]);

  switch (windowType) {
    case WindowType.Trash:
      return (
        <MenuList
          menuList={[
            { name: "Empty Trash", action: handleEmptyTrash },
            { name: "/", action: () => {} },
            { name: "Refresh", action: handleRefresh },
          ]}
        />
      );
    case WindowType.Navigator:
      return (
        <MenuList
          menuList={[
            { name: "Upload", action: handleUpload },
            { name: "Create Folder", action: handleCreateContainer },
            { name: "/", action: () => {} },
            { name: "Refresh", action: handleRefresh },
          ]}
        />
      );
    default:
      return null;
  }
}
