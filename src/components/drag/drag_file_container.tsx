import { useEventStore } from "@/store/event.store";
import { useFileStore } from "@/store/file.store";
import { useMenuStore } from "@/store/menu.store";
import { useWindowStore } from "@/store/window.store";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./drag_file_container.module.css";
import { parseSerialKey } from "@/utils/serial_key";
import { WindowType } from "@/interfaces/window";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fileQuery } from "@/api/query";
import { FileType } from "@/interfaces/file";

export default function DragFileContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  // Query client
  const queryClient = useQueryClient();

  // States
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingReady, setIsDraggingReady] = useState(false);
  const [displayDraggingElements, setDisplayDraggingElements] = useState(false);
  const [pointerMoved, setPointerMoved] = useState(false); // To prevent the click event from being triggered when dragging

  // Refs
  const draggingFileRef = useRef<HTMLDivElement>(null);

  // Store states
  const currentWindow = useWindowStore((state) => state.currentWindow);
  const menuRef = useMenuStore((state) => state.menuRef);
  const highlightedFile = useFileStore((state) => state.highlightedFile);
  const selectedFileSerials = useFileStore(
    (state) => state.selectedFileSerials,
  );
  const fileIconRefs = useFileStore((state) => state.fileIconRefs);
  const pressedKeys = useEventStore((state) => state.pressedKeys);

  // Store actions
  const findWindow = useWindowStore((state) => state.findWindow);
  const isFileKeySelected = useFileStore((state) => state.isFileKeySelected);
  const selectFile = useFileStore((state) => state.selectFile);
  const unselectAllFiles = useFileStore((state) => state.unselectAllFiles);

  // Queries
  const moveFile = useMutation(fileQuery.update.parent);

  // Drag file start
  const dragFileStart = useCallback(
    (e: MouseEvent) => {
      if (menuRef?.current?.contains(e.target as Node)) return;

      // If the mouse event is not triggered on an file item
      if (!highlightedFile) return;
      // If the mouse event is triggered on an file item
      else if (highlightedFile?.ref.current?.contains(e.target as Node)) {
        // If the file is not selected and the shift key is not pressed
        if (
          !isFileKeySelected(highlightedFile.fileKey) &&
          !pressedKeys.includes("Shift")
        ) {
          unselectAllFiles();
        }
        selectFile(highlightedFile.fileKey, highlightedFile.windowKey);
      }
      setPointerMoved(false);
      setStart({ x: e.clientX, y: e.clientY });
      setIsDraggingReady(true);
    },
    [
      highlightedFile,
      isFileKeySelected,
      menuRef,
      pressedKeys,
      selectFile,
      unselectAllFiles,
    ],
  );

  // Create dragging file clone
  const createDraggingFile = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (
        highlightedFile?.ref.current &&
        isDraggingReady &&
        !isDragging &&
        Math.abs(e.clientX - start.x) > 5 &&
        Math.abs(e.clientY - start.y) > 5
      ) {
        document.body.style.cursor = "grabbing";
        setIsDragging(true);
        setDisplayDraggingElements(true);
        setPointerMoved(true);

        // Create a clone of the highlighted file
        let count = 0;
        let width = 0;
        selectedFileSerials.forEach((serialKey) => {
          const fileIconRef = fileIconRefs.get(serialKey);
          if (fileIconRef?.current && count < 4) {
            const fileRect = fileIconRef.current.getBoundingClientRect();
            const clone = fileIconRef.current.cloneNode(true) as HTMLElement;
            clone.style.position = "absolute";
            clone.style.left = -fileRect.width / 2 + "px";
            clone.style.top = -fileRect.height - count * 5 + "px";
            clone.style.zIndex = `${-count}`;
            draggingFileRef.current?.appendChild(clone);

            if (count === 0) {
              width = fileRect.width;
            }
            count++;
          }
        });

        // Update the count element
        const countElement = document.createElement("div");
        countElement.innerText = `${selectedFileSerials.length}`;
        countElement.className = styles.dragging_file_count;
        countElement.style.left = `${width / 2 - 12}px`;
        draggingFileRef.current?.appendChild(countElement);
      }
    },
    [
      fileIconRefs,
      highlightedFile?.ref,
      isDragging,
      isDraggingReady,
      selectedFileSerials,
      start.x,
      start.y,
    ],
  );

  // Drag file
  const dragFile = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      if (!draggingFileRef.current) return;
      e.preventDefault();
      draggingFileRef.current.style.left = e.clientX + "px";
      draggingFileRef.current.style.top = e.clientY + "px";
    },
    [isDragging],
  );

  // Drag file end
  const dragFileEnd = useCallback(async () => {
    setIsDragging(false);
    setIsDraggingReady(false);
    setDisplayDraggingElements(false);
    if (!isDragging) return;
    if (!draggingFileRef.current) return;
    document.body.style.cursor = "default";
    draggingFileRef.current.innerHTML = "";
    document.body.style.cursor = "default";
    let targetContainerKey: string | null = null;

    // Set target container key as the current window key
    if (currentWindow && currentWindow.windowRef.current) {
      const window = findWindow(currentWindow.key);
      if (
        window &&
        (window.type === WindowType.Background ||
          window.type === WindowType.Navigator)
      ) {
        targetContainerKey = window.targetKey;
      }
    }

    // Set the target folder key as the highlighted file key
    if (
      highlightedFile &&
      (highlightedFile.type === FileType.Container ||
        highlightedFile.type === FileType.Root ||
        highlightedFile.type === FileType.Home ||
        highlightedFile.type === FileType.Trash)
    ) {
      targetContainerKey = highlightedFile.fileKey;
    } else if (highlightedFile && highlightedFile.type === FileType.Link) {
      // Get the linked file
      const linkedFile = await queryClient.fetchQuery(
        fileQuery.read.linkTarget(highlightedFile.fileKey),
      );
      // Set the target folder key as the linked file key
      if (
        linkedFile.status === 200 &&
        linkedFile.data &&
        linkedFile.data.type === FileType.Container
      ) {
        targetContainerKey = linkedFile.data.fileKey;
      } else {
        // If the linked file is not a container, set the target folder key as null
        targetContainerKey = null;
      }
    } else if (highlightedFile) {
      // If the highlighted file is not a container or a link, set the target folder key as null
      targetContainerKey = null;
    }

    // Move the selected elements to the target folder
    if (targetContainerKey && pointerMoved) {
      // Get the file keys of the selected files
      const fileKeys = selectedFileSerials.map(
        (serialKey) => parseSerialKey(serialKey).fileKey,
      );
      // Get the parent file keys of the selected files
      const parentFileKeys = await Promise.all(
        fileKeys.map((fileKey) =>
          queryClient
            .fetchQuery(fileQuery.read.parent(fileKey))
            .then((data) => data.data.fileKey),
        ),
      );
      // Move the selected files to the target folder
      Promise.all(
        fileKeys.map((fileKey, index) => {
          if (parentFileKeys[index] !== targetContainerKey) {
            return moveFile
              .mutateAsync({
                fileKey,
                parentKey: targetContainerKey,
              })
              .then(() => {
                queryClient.invalidateQueries({
                  queryKey: ["file", targetContainerKey],
                });
                queryClient.invalidateQueries({
                  queryKey: ["file", fileKey],
                });
                queryClient.invalidateQueries({
                  queryKey: ["file", parentFileKeys[index]],
                });
              });
          }
        }),
      ).finally(() => {
        unselectAllFiles();
      });
    }
  }, [
    currentWindow,
    findWindow,
    highlightedFile,
    isDragging,
    moveFile,
    pointerMoved,
    queryClient,
    selectedFileSerials,
    unselectAllFiles,
  ]);

  // Event listeners
  useEffect(() => {
    document.addEventListener("mousedown", dragFileStart);
    return () => {
      document.removeEventListener("mousedown", dragFileStart);
    };
  }, [dragFileStart]);

  useEffect(() => {
    document.addEventListener("mousemove", createDraggingFile);
    return () => {
      document.removeEventListener("mousemove", createDraggingFile);
    };
  }, [createDraggingFile]);

  useEffect(() => {
    document.addEventListener("mousemove", dragFile);
    return () => {
      document.removeEventListener("mousemove", dragFile);
    };
  }, [dragFile]);

  useEffect(() => {
    document.addEventListener("mouseup", dragFileEnd);
    return () => {
      document.removeEventListener("mouseup", dragFileEnd);
    };
  }, [dragFileEnd]);

  return (
    <div className="full-size">
      <div
        ref={draggingFileRef}
        hidden={!displayDraggingElements}
        className={`${styles.dragging_files}`}
      ></div>
      {children}
    </div>
  );
}
