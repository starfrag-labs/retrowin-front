"use client";

import { useQueryClient } from "@tanstack/react-query";
import { RedirectType, redirect } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGetHomeContainer, useGetUser, useCreateUser } from "@/api/generated";
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
  // Constants
  const backgroundWindowKey = useMemo(() => createWindowKey(), []);

  // States
  const [homeKey, setHomeKey] = useState<string | null>(null);

  // Store states
  const windows = useWindowStore((state) => state.windows);
  // Store actions
  const newBackgroundWindow = useWindowStore((state) => state.newWindow);
  const setCurrentWindow = useWindowStore((state) => state.setCurrentWindow);

  // Refs
  const backgroundWindowRef = useRef<HTMLDivElement>(null);

  // Queries - use Orval's generated hooks directly
  const queryClient = useQueryClient();
  const homeKeyQuery = useGetHomeContainer({
    query: { retry: false, select: (data) => ("file" in data.data ? data.data.file : null) },
    fetch: { credentials: "include" },
  });
  const getMemberQuery = useGetUser({
    query: { retry: false, select: (data) => ("user" in data.data ? data.data.user : null) },
    fetch: { credentials: "include" },
  });
  const createMemberMutation = useCreateUser();

  useEffect(() => {
    if (homeKey) {
      newBackgroundWindow({
        targetKey: homeKey,
        type: WindowType.Background,
        title: "background",
        key: backgroundWindowKey,
      });
    }
  }, [backgroundWindowKey, newBackgroundWindow, homeKey]);

  useEffect(() => {
    if (homeKeyQuery.isSuccess && homeKeyQuery.data) {
      setHomeKey(homeKeyQuery.data.fileKey);
    }
  }, [homeKeyQuery.data, homeKeyQuery.isSuccess]);

  useEffect(() => {
    if (homeKeyQuery.isError) {
      const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
      const errorStatus = (homeKeyQuery.error as any)?.status;
      if (errorStatus === 401 && redirectUri) {
        redirect(redirectUri, RedirectType.push);
      } else if (
        errorStatus === 403 &&
        getMemberQuery.isError &&
        (getMemberQuery.error as any)?.status === 404 &&
        !createMemberMutation.isPending
      ) {
        // If the user is not a member of the service, create a member
        createMemberMutation
          .mutateAsync({ data: { provider: "keycloak", providerId: "auto" } })
          .then(() => {
            queryClient.invalidateQueries();
          })
          .catch(() => {
            throw new Error("Failed to create member");
          });
      } else if (
        errorStatus === 403 &&
        getMemberQuery.isSuccess
      ) {
        throw new Error("You are not a member of this service");
      } else {
        throw new Error("Failed to get home");
      }
    }
  }, [
    createMemberMutation,
    getMemberQuery.error,
    getMemberQuery.isError,
    getMemberQuery.isSuccess,
    homeKeyQuery.error,
    homeKeyQuery.isError,
    queryClient,
  ]);

  const onMouseEnter = useCallback(() => {
    setCurrentWindow({
      key: backgroundWindowKey,
      windowRef: backgroundWindowRef,
      contentRef: null,
      headerRef: null,
    });
  }, [backgroundWindowKey, setCurrentWindow]);

  if (!homeKey) {
    return <div></div>;
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
                  containerKey={homeKey}
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
