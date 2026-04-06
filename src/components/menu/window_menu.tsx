import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { ls, useMkdir, useUnlink } from "@/api/generated";
import { useWindowStore } from "@/store/window.store";
import { WindowType } from "@/types/window";
import { isFsQuery } from "@/utils/query_keys";
import MenuList from "./menu_list";

export default function WindowMenu({
  path,
  windowType,
  closeMenu,
}: {
  path: string;
  windowType: WindowType | null;
  closeMenu: () => void;
}) {
  // Query client
  const queryClient = useQueryClient();

  // Get system ID from window store
  const windows = useWindowStore((state) => state.windows);
  const currentWindow = windows.find((w) => w.targetKey === path);
  const systemId = currentWindow?.systemId || "";

  // Store actions
  const newWindow = useWindowStore((state) => state.newWindow);

  // Mutations
  const mkdirMutation = useMkdir();
  const unlinkMutation = useUnlink();

  // Handle upload action
  const handleUpload = useCallback(() => {
    newWindow({
      targetKey: path,
      type: WindowType.Uploader,
      title: "Uploader",
      systemId,
    });
    closeMenu();
  }, [closeMenu, newWindow, path, systemId]);

  const handleCreateContainer = useCallback(async () => {
    if (!path || !systemId) return;

    await mkdirMutation
      .mutateAsync({
        systemId,
        data: {
          path: `${path === "/" ? "" : path}/New Folder`,
          mode: 0o755,
        },
      })
      .then(() => {
        queryClient.invalidateQueries({
          predicate: isFsQuery,
        });
        closeMenu();
      });
  }, [path, systemId, closeMenu, mkdirMutation, queryClient]);

  const handleEmptyTrash = useCallback(async () => {
    if (!path || !systemId) return;
    closeMenu();

    // Get all files in trash directory
    const readDirResult = await ls(
      systemId,
      { path },
      { credentials: "include" }
    );

    if (readDirResult.data && "entries" in readDirResult.data) {
      Promise.all(
        readDirResult.data.entries.map((entry) =>
          unlinkMutation.mutateAsync({
            systemId,
            params: { path: `${path === "/" ? "" : path}/${entry.name}` },
          })
        )
      ).then(() => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            const key = query.queryKey[0] as string;
            return key === "readDir" || key === "statPath";
          },
        });
      });
    }
  }, [path, systemId, closeMenu, unlinkMutation, queryClient]);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey[0] as string;
        return key === "readDir" || key === "statPath";
      },
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
