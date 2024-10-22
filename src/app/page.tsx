"use client";

import FileContainer from "@/components/file/file_container";
import styles from "./page.module.css";
import Background from "@/components/layout/background";
import Navbar from "@/components/layout/navbar/navbar_container";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowStore } from "@/store/window.store";
import SelectBoxContainer from "@/components/select/select_box_container";
import { useSelectBoxStore } from "@/store/select_box.store";
import DragFileContainer from "@/components/drag/drag_file_container";
import Window from "@/components/window/window";
import { useQuery } from "@tanstack/react-query";
import { fileQuery } from "@/api/query";
import MenuBox from "@/components/menu/menu_box";
import { createWindowKey } from "@/utils/random_key";

export default function Home() {
  // Constants
  const backgroundWindowKey = useMemo(() => createWindowKey(), []);

  // States
  const [rootKey, setRootKey] = useState<string | null>(null);

  // Store states
  const windows = useWindowStore((state) => state.windows);
  // Store actions
  const setBackgroundWindow = useWindowStore(
    (state) => state.setBackgroundWindow,
  );
  const setCurrentWindowKey = useSelectBoxStore(
    (state) => state.setCurrentWindowKey,
  );

  // Refs
  const backgroundWindowRef = useRef(null);

  // Queries
  const rootKeyQuery = useQuery(fileQuery.read.root);

  useEffect(() => {
    setCurrentWindowKey(backgroundWindowKey);
  }, [backgroundWindowKey, setCurrentWindowKey]);

  useEffect(() => {
    if (rootKey) {
      setBackgroundWindow({
        key: backgroundWindowKey,
        targetKey: rootKey,
        ref: backgroundWindowRef,
      });
    }
  }, [backgroundWindowKey, backgroundWindowRef, rootKey, setBackgroundWindow]);

  useEffect(() => {
    if (rootKeyQuery.isSuccess && rootKeyQuery.data) {
      setRootKey(rootKeyQuery.data.data.fileKey);
    }
  }, [rootKeyQuery.data, rootKeyQuery.isSuccess]);

  if (rootKeyQuery.isLoading || !rootKey) {
    return <div></div>;
  }

  return (
    <div
      className={`${styles.page} flex-center full-size`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Background>
        <MenuBox>
          <SelectBoxContainer>
            <DragFileContainer>
              <div
                ref={backgroundWindowRef}
                className={`full-size flex-center ${styles.background_window}`}
              >
                <FileContainer
                  windowKey={backgroundWindowKey}
                  containerKey={rootKey}
                />
              </div>
              {windows.map((window) => (
                <Window key={window.key} windowKey={window.key} />
              ))}
            </DragFileContainer>
          </SelectBoxContainer>
        </MenuBox>
      </Background>
      <Navbar />
    </div>
  );
}
