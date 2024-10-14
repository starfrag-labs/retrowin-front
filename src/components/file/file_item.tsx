"use client";

import FileIcon from "./file_icon";
import FileName from "./file_name";
import styles from "./file_item.module.css";
import { useFileStore } from "@/store/file.store";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelectBoxStore } from "@/store/select_box.store";

export default memo(function FileItem({
  name,
  type,
  fileKey,
  windowKey,
}: {
  name: string;
  type: "block" | "container" | "upload";
  fileKey: string;
  windowKey: string;
}) {
  // constants
  const serialKey = `${fileKey}:${windowKey}`;
  const selectedFileBackground = "#f0f0f033";

  // State
  const [isSelected, setIsSelected] = useState(false);

  // Store state
  const selectedFileSerials = useFileStore(
    (state) => state.selectedFileSerials,
  );
  const selectBox = useSelectBoxStore((state) => state.rect);
  const targetWindow = useSelectBoxStore((state) => state.currentWindowKey);
  // Store actions
  const setFileRef = useFileStore((state) => state.setFileRef);
  const setHighlightedFile = useFileStore((state) => state.setHighlightedFile);
  const selectFile = useFileStore((state) => state.selectFile);
  const unselectFile = useFileStore((state) => state.unselectFile);

  // Refs
  const fileRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    setHighlightedFile({
      fileKey,
      windowKey,
      ref: fileRef,
    });
  }, [setHighlightedFile, fileKey, windowKey]);

  const handleMouseLeave = useCallback(() => {
    setHighlightedFile(null);
  }, [setHighlightedFile]);

  // Check if the file is in the select box
  const checkFileInSelectBox = useCallback(() => {
    if (!selectBox) return;
    if (!fileRef.current) return;
    if (windowKey !== targetWindow) return;
    const fileRect = fileRef.current.getBoundingClientRect();
    if (
      (type === "container" || type === "block") &&
      fileRect.top < selectBox.bottom &&
      fileRect.bottom > selectBox.top &&
      fileRect.left < selectBox.right &&
      fileRect.right > selectBox.left
    ) {
      selectFile(fileKey, windowKey);
    } else {
      unselectFile(fileKey, windowKey);
    }
  }, [
    fileKey,
    selectBox,
    selectFile,
    targetWindow,
    type,
    unselectFile,
    windowKey,
  ]);

  useEffect(() => {
    checkFileInSelectBox();
  }, [checkFileInSelectBox]);

  // Assign fileRef to store
  useEffect(() => {
    setFileRef(fileKey, windowKey, fileRef);
  }, [fileKey, fileRef, setFileRef, windowKey]);

  // Check if the file is in the select box
  useEffect(() => {
    setIsSelected(selectedFileSerials.includes(serialKey));
  }, [selectedFileSerials, serialKey]);

  return (
    <div className={`full-size ${styles.container}`}>
      <div
        className={`${styles.item}`}
        ref={fileRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundColor: isSelected ? selectedFileBackground : "",
        }}
      >
        <FileIcon type={type} />
        <FileName name={name} />
      </div>
    </div>
  );
});
