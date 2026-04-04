"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useGetUser,
  useListSystems,
  useGetRootDirectory,
} from "@/api/generated";
import DragFileContainer from "@/components/drag/drag_file_container";
import FileContainer from "@/components/file/file_container";
import Background from "@/components/layout/background";
import Navbar from "@/components/layout/navbar/navbar_container";
import MenuBox from "@/components/menu/menu_box";
import SelectBoxContainer from "@/components/select/select_box_container";
import Window from "@/components/window/window";
import { WindowType } from "@/interfaces/window";
import { useWindowStore } from "@/store/window.store";
import { createWindowKey } from "@/utils/random_key";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  // Constants
  const backgroundWindowKey = useMemo(() => createWindowKey(), []);

  // States
  const [homeKey, setHomeKey] = useState<string | null>(null);
  const [currentSystemId, setCurrentSystemId] = useState<string | null>(null);
  const [currentPath, _setCurrentPath] = useState<string>("/home");

  // Store states
  const windows = useWindowStore((state) => state.windows);
  // Store actions
  const newBackgroundWindow = useWindowStore((state) => state.newWindow);
  const setCurrentWindow = useWindowStore((state) => state.setCurrentWindow);

  // Refs
  const backgroundWindowRef = useRef<HTMLDivElement>(null);

  // Queries - use Orval's generated hooks directly
  const _queryClient = useQueryClient();

  // Get current user (keep full response to check status)
  const getUserQuery = useGetUser({
    query: {
      retry: false,
    },
    fetch: { credentials: "include" },
  });

  // Get systems list
  const listSystemsQuery = useListSystems({
    query: {
      retry: false,
      select: (data) => (data.status === 200 ? data.data.systems : []),
      enabled: getUserQuery.data?.status === 200,
    },
    fetch: { credentials: "include" },
  });

  // Get root directory for first system
  const rootDirectoryQuery = useGetRootDirectory(currentSystemId ?? "", {
    query: {
      retry: false,
      select: (data) => (data.status === 200 ? data.data.inode : null),
      enabled: !!currentSystemId,
    },
    fetch: { credentials: "include" },
  });

  // Redirect to login on auth error (401)
  useEffect(() => {
    if (getUserQuery.data?.status === 401) {
      console.error("Auth failed: 401 Unauthorized");
      router.push("/login");
    }
  }, [getUserQuery.data?.status, router]);

  // Set current system ID when systems are loaded
  useEffect(() => {
    if (
      listSystemsQuery.isSuccess &&
      listSystemsQuery.data.length > 0 &&
      !currentSystemId
    ) {
      setCurrentSystemId(listSystemsQuery.data[0].id);
    }
  }, [listSystemsQuery.data, listSystemsQuery.isSuccess, currentSystemId]);

  useEffect(() => {
    if (homeKey && currentSystemId) {
      newBackgroundWindow({
        targetKey: currentPath,
        type: WindowType.Background,
        title: "background",
        key: backgroundWindowKey,
        systemId: currentSystemId,
      });
    }
  }, [
    backgroundWindowKey,
    newBackgroundWindow,
    homeKey,
    currentSystemId,
    currentPath,
  ]);

  useEffect(() => {
    if (rootDirectoryQuery.isSuccess && rootDirectoryQuery.data) {
      setHomeKey(rootDirectoryQuery.data.id);
    }
  }, [rootDirectoryQuery.data, rootDirectoryQuery.isSuccess]);

  const onMouseEnter = useCallback(() => {
    setCurrentWindow({
      key: backgroundWindowKey,
      windowRef: backgroundWindowRef,
      contentRef: null,
      headerRef: null,
    });
  }, [backgroundWindowKey, setCurrentWindow]);

  // Show loading while checking auth or loading data
  if (
    getUserQuery.isLoading ||
    getUserQuery.isPending ||
    !homeKey ||
    !currentSystemId
  ) {
    return <div className="flex-center full-size">Loading...</div>;
  }

  return (
    <div
      className={`${styles.page} flex-center full-size`}
      onContextMenu={(e) => e.preventDefault()}
      role="application"
    >
      <Background>
        <MenuBox>
          <SelectBoxContainer>
            <DragFileContainer>
              <section
                ref={backgroundWindowRef}
                className={`full-size flex-center ${styles.background_window}`}
                onMouseEnter={onMouseEnter}
                aria-label="background workspace"
              >
                <FileContainer
                  windowKey={backgroundWindowKey}
                  systemId={currentSystemId ?? ""}
                  path={currentPath}
                  upload
                  trash
                  backgroundFile
                />
              </section>
              {windows
                .filter((w) => w.type !== WindowType.Background)
                .map((window) => (
                  <Window key={window.key} windowKey={window.key} />
                ))}
            </DragFileContainer>
          </SelectBoxContainer>
        </MenuBox>
      </Background>
      <Navbar windows={windows} />
    </div>
  );
}
