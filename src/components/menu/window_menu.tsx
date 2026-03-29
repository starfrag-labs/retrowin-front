import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useCreateFile, useDeleteFile, useGetFileChildren } from "@/api/generated";
import { getFileChildren } from "@/api/generated";
import { WindowType } from "@/interfaces/window";
import { useWindowStore } from "@/store/window.store";
import MenuList from "./menu_list";

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
  const createContainerMutation = useCreateFile();
  const deleteFilePermanentMutation = useDeleteFile();

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
    const result = await createContainerMutation.mutateAsync({
      data: { type: "container", fileName: "New Folder", parentKey: targetFileKey },
    });
    if (result.data) {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "file",
      });
      closeMenu();
    }
  }, [closeMenu, createContainerMutation, queryClient, targetFileKey]);

  const handleEmptyTrash = useCallback(async () => {
    closeMenu();
    const files = await getFileChildren(targetFileKey, { credentials: "include" });
    if (files.data && "files" in files.data) {
      Promise.all(
        files.data.files.map((file) =>
          deleteFilePermanentMutation.mutateAsync({ fileKey: file.fileKey, params: { permanent: true } })
        )
      ).then(() => {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "file",
        });
      });
    }
  }, [closeMenu, deleteFilePermanentMutation, queryClient, targetFileKey]);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "file",
    });
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
