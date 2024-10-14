"use client";

import FileContainer from "@/components/file/file_container";
import styles from "./page.module.css";
import Background from "@/components/layout/background";
import Navbar from "@/components/layout/navbar/navbar_container";
import { useEffect, useRef } from "react";
import { useWindowStore } from "@/store/window.store";
import SelectBoxContainer from "@/components/select/select_box_container";
import { useSelectBoxStore } from "@/store/select_box.store";
import DragFileContainer from "@/components/drag/drag_file_container";

export default function Home() {
  // Constants
  const generatedWindowKey = "generated";

  // Store actions
  const setBackgroundWindowRef = useWindowStore(
    (state) => state.setBackgroundWindowRef,
  );
  const setCurrentWindowKey = useSelectBoxStore(
    (state) => state.setCurrentWindowKey,
  );

  // Refs
  const backgroundWindowRef = useRef(null);

  useEffect(() => {
    setCurrentWindowKey(generatedWindowKey);
  }, [setCurrentWindowKey]);

  useEffect(() => {
    setBackgroundWindowRef(backgroundWindowRef);
  }, [backgroundWindowRef, setBackgroundWindowRef]);

  return (
    <div className={styles.page}>
      <Background>
        <SelectBoxContainer>
          <DragFileContainer>
            <div ref={backgroundWindowRef} className="full-size">
              <FileContainer windowKey={generatedWindowKey} />
            </div>
          </DragFileContainer>
        </SelectBoxContainer>
      </Background>
      <Navbar />
    </div>
  );
}
