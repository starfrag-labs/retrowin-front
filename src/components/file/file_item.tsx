"use client";

import FileIcon from "./file_icon";
import FileName from "./file_name";
import styles from "./file_item.module.css";
import { useFileStore } from "@/store/file.store";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelectBoxStore } from "@/store/select_box.store";
import { useWindowStore } from "@/store/window.store";
import { WindowType } from "@/interfaces/window";
import { createSerialKey } from "@/utils/serial_key";
import { FileType, FileIconType } from "@/interfaces/file";
import { ContentTypes, getContentTypes } from "@/utils/content_types";
import { useQuery } from "@tanstack/react-query";
import { fileQuery } from "@/api/query";
import FileDetail from "./file_detail";

/**
 * File item component
 * @param name - name of the file
 * @param type - type of the file
 * @param fileKey - key of the file
 * @param windowKey - key of the window
 * @param backgroundFile - Is background file
 * @returns - File item component
 * @example
 * <FileItem name="file" type={FileType.Container} fileKey="e03431b7-6d67-4ee2-9224-e93dc04f25c4" windowKey="421b0ad1f948" />
 */
export default memo(function FileItem({
  name,
  type,
  fileKey,
  windowKey,
  backgroundFile = false,
}: {
  name: string;
  type: FileType;
  fileKey: string;
  windowKey: string;
  backgroundFile?: boolean;
}) {
  // constants
  const serialKey = createSerialKey(fileKey, windowKey);
  const selectedFileBackground = "#f0f0f033";

  // States
  const [icon, setIcon] = useState<FileIconType | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Store state
  const selectedFileSerials = useFileStore(
    (state) => state.selectedFileSerials,
  );
  const selectBox = useSelectBoxStore((state) => state.rect);
  const targetWindow = useSelectBoxStore((state) => state.currentWindowKey);
  // Store actions
  const setFileIconRef = useFileStore((state) => state.setFileIconRef);
  const setHighlightedFile = useFileStore((state) => state.setHighlightedFile);
  const selectFile = useFileStore((state) => state.selectFile);
  const unselectFile = useFileStore((state) => state.unselectFile);
  const newWindow = useWindowStore((state) => state.newWindow);
  const getBackgroundWindow = useWindowStore(
    (state) => state.getBackgroundWindow,
  );
  const updateWindow = useWindowStore((state) => state.updateWindow);

  // Refs
  const fileRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const showDetailTimeoutRef = useRef<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const linkTargetQuery = useQuery(
    fileQuery.read.linkTarget(type === FileType.Link ? fileKey : ""),
  );

  // Get background window key
  const backgroundWindowKey = useMemo(() => {
    const backgroundWindow = getBackgroundWindow();
    return backgroundWindow?.key || "";
  }, [getBackgroundWindow]);

  // Query
  const fileInfoQuery = useQuery(fileQuery.read.info(fileKey));

  const handleMouseEnter = useCallback(() => {
    setHighlightedFile({
      fileKey,
      windowKey,
      fileName: name,
      type,
      ref: fileRef,
    });
    showDetailTimeoutRef.current = window.setTimeout(() => {
      setShowDetail(true);
    }, 750);
  }, [setHighlightedFile, fileKey, windowKey, name, type]);

  const handleMouseLeave = useCallback(() => {
    setHighlightedFile(null);
    setShowDetail(false);
    if (showDetailTimeoutRef.current) {
      clearTimeout(showDetailTimeoutRef.current);
    }
    detailRef.current?.style.setProperty("visibility", "hidden");
  }, [setHighlightedFile]);

  // Check if the file is in the select box
  const checkFileInSelectBox = useCallback(() => {
    if (!selectBox) return;
    if (!fileRef.current) return;
    if (windowKey !== targetWindow) return;
    const fileRect = fileRef.current.getBoundingClientRect();
    if (
      (type === FileType.Container ||
        type === FileType.Block ||
        type === FileType.Link) &&
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

  // Check if the file is in the select box
  useEffect(() => {
    checkFileInSelectBox();
  }, [checkFileInSelectBox]);

  // Set icon type
  useEffect(() => {
    switch (type) {
      case FileType.Container:
        setIcon(FileIconType.Container);
        break;
      case FileType.Upload:
        setIcon(FileIconType.Upload);
        break;
      case FileType.Block:
        setIcon(FileIconType.Block);
        break;
      case FileType.Home:
        setIcon(FileIconType.Home);
        break;
      case FileType.Trash:
        setIcon(FileIconType.Trash);
        break;
      case FileType.Link:
        setIcon(FileIconType.Block);
        break;
    }
  }, [type]);

  // Assign fileRef to store
  useEffect(() => {
    setFileIconRef(fileKey, windowKey, iconRef);
  }, [fileKey, setFileIconRef, windowKey]);

  const clickContaienr = useCallback(
    ({ fileKey, name }: { fileKey: string; name: string }) => {
      if (windowKey === backgroundWindowKey) {
        newWindow({
          targetKey: fileKey,
          type: WindowType.Navigator,
          title: name,
        });
      } else {
        setHighlightedFile(null);
        updateWindow({
          targetWindowKey: windowKey,
          targetFileKey: fileKey,
          title: name,
        });
      }
    },
    [
      backgroundWindowKey,
      newWindow,
      updateWindow,
      setHighlightedFile,
      windowKey,
    ],
  );

  const clickBlock = useCallback(
    ({ fileKey, name }: { fileKey: string; name: string }) => {
      const contentType = getContentTypes(name);
      switch (contentType) {
        case ContentTypes.Image:
          newWindow({
            targetKey: fileKey,
            type: WindowType.Image,
            title: name,
          });
          break;
        case ContentTypes.Video:
          newWindow({
            targetKey: fileKey,
            type: WindowType.Video,
            title: name,
          });
          break;
        case ContentTypes.Audio:
          newWindow({
            targetKey: fileKey,
            type: WindowType.Audio,
            title: name,
          });
          break;
      }
    },
    [newWindow],
  );

  const clickUpload = useCallback(
    ({ fileKey, name }: { fileKey: string; name: string }) => {
      if (backgroundWindowKey === windowKey) {
        newWindow({
          targetKey: fileKey,
          type: WindowType.Uploader,
          title: name,
        });
      } else {
        setHighlightedFile(null);
        updateWindow({
          targetWindowKey: windowKey,
          targetFileKey: fileKey,
          type: WindowType.Uploader,
          title: name,
        });
      }
    },
    [
      backgroundWindowKey,
      newWindow,
      updateWindow,
      setHighlightedFile,
      windowKey,
    ],
  );

  const clickTrash = useCallback(
    ({ fileKey, name }: { fileKey: string; name: string }) => {
      if (backgroundWindowKey === windowKey) {
        newWindow({
          targetKey: fileKey,
          type: WindowType.Trash,
          title: name,
        });
      } else {
        setHighlightedFile(null);
        updateWindow({
          targetWindowKey: windowKey,
          targetFileKey: fileKey,
          type: WindowType.Trash,
          title: name,
        });
      }
    },
    [
      backgroundWindowKey,
      newWindow,
      updateWindow,
      setHighlightedFile,
      windowKey,
    ],
  );

  const iconClick = useCallback(() => {
    switch (type) {
      case FileType.Container: // If the file is a container, open the navigator window
        clickContaienr({
          fileKey,
          name,
        });
        break;
      case FileType.Block: // If the file is a block, open the file by its content type
        clickBlock({
          fileKey,
          name,
        });
        break;
      case FileType.Upload: // If the file is an upload, open uploader
        clickUpload({
          fileKey,
          name,
        });
        break;
      case FileType.Link:
        if (linkTargetQuery.data) {
          const linkTarget = linkTargetQuery.data.data;
          if (linkTarget && linkTarget.type === FileType.Container) {
            clickContaienr({
              fileKey: linkTarget.fileKey,
              name: linkTarget.fileName,
            });
          } else if (linkTarget && linkTarget.type === FileType.Block) {
            clickBlock({
              fileKey: linkTarget.fileKey,
              name: linkTarget.fileName,
            });
          }
        }
        break;
      case FileType.Home:
        clickContaienr({
          fileKey,
          name,
        });
        break;
      case FileType.Trash:
        clickTrash({
          fileKey,
          name,
        });
        break;
    }
  }, [
    clickBlock,
    clickContaienr,
    clickTrash,
    clickUpload,
    fileKey,
    linkTargetQuery.data,
    name,
    type,
  ]);

  // Detail position adjustment
  useEffect(() => {
    if (
      showDetail &&
      detailRef.current &&
      fileRef.current &&
      fileInfoQuery.isFetched &&
      fileInfoQuery.data &&
      fileInfoQuery.data.status === 200
    ) {
      const fileRect = fileRef.current.getBoundingClientRect();
      const detailRect = detailRef.current.getBoundingClientRect();
      const windowRect = document.body.getBoundingClientRect();
      if (fileRect.right + detailRect.width > windowRect.right) {
        detailRef.current.style.left = `-${
          detailRect.width + fileRect.width / 2
        }px`;
      } else {
        detailRef.current.style.left = `${fileRect.width}px`;
      }
      if (fileRect.bottom + detailRect.height > windowRect.bottom) {
        detailRef.current.style.top = `-${
          detailRect.height + fileRect.height / 2
        }px`;
      } else {
        detailRef.current.style.top = `${fileRect.height}px`;
      }
      detailRef.current.style.visibility = "visible";
    }
  }, [fileInfoQuery.data, fileInfoQuery.isFetched, showDetail]);

  return (
    <div className={`full-size ${styles.container}`}>
      <div
        className={`${styles.item_wrapper}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundColor: selectedFileSerials.includes(serialKey)
            ? selectedFileBackground
            : "",
        }}
      >
        <div className={`full-size flex-center ${styles.item}`} ref={fileRef}>
          {icon && <FileIcon ref={iconRef} onClick={iconClick} icon={icon} />}
          <FileName
            name={name}
            fileKey={fileKey}
            windowKey={windowKey}
            backgroundFile={backgroundFile}
          />
        </div>
      </div>
      {showDetail &&
        (type === FileType.Block || type === FileType.Container) &&
        fileInfoQuery.isFetched &&
        fileInfoQuery.data && (
          <FileDetail
            ref={detailRef}
            fileName={name}
            fileType={type}
            bytes={fileInfoQuery.data.data.byteSize}
            created={fileInfoQuery.data.data.createDate}
            modified={fileInfoQuery.data.data.updateDate}
          />
        )}
    </div>
  );
});
