import { useEventStore } from "@/store/event.store";
import { useFileStore } from "@/store/file.store";
import { useMenuStore } from "@/store/menu.store";
import { useWindowStore } from "@/store/window.store";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./drag_file_container.module.css";

export default function DragFileContainer({
  children,
}: {
  children: React.ReactNode;
}) {
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
          if (fileIconRef?.current && count < 4 ) {
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
  const dragFileEnd = useCallback(
    (e: MouseEvent) => {
      setIsDragging(false);
      setIsDraggingReady(false);
      setDisplayDraggingElements(false);
      if (!isDragging) return;
      if (!draggingFileRef.current) return;
      document.body.style.cursor = "default";
      draggingFileRef.current.innerHTML = "";
      document.body.style.cursor = "default";
      let targetFolderKey: string = "";

      // Search for the target folder from the background
      if (currentWindow && currentWindow.windowRef.current) {
        const window = findWindow(currentWindow.key);
        if (window && window.type === "navigator") {
          targetFolderKey = window.targetKey;
        }
      }

      //if (
      //  currentElement &&
      //  getElementInfo(currentElement.key)?.type === "folder"
      //) {
      //  targetFolderKey = currentElement.key;
      //}

      // Move the selected elements to the target folder
      if (targetFolderKey && pointerMoved) {
        selectedFileSerials.forEach((serialKey) => {
          const fileKey = serialKey.split(":")[0];
          //const info = getElementInfo(fileKey);
          if (!isFileKeySelected(fileKey) || fileKey === targetFolderKey)
            return;
          //if (info.type === 'folder') {
          //  moveFolder
          //    .mutateAsync({ folderKey: serialKey, targetKey: targetFolderKey })
          //    .then(() => {
          //      queryClient.invalidateQueries({
          //        queryKey: generateQueryKey('folder', targetFolderKey),
          //      });
          //      queryClient.invalidateQueries({
          //        queryKey: generateQueryKey('folder', info.parentKey),
          //      });
          //    });
          //} else if (info.type === 'file') {
          //  moveFile
          //    .mutateAsync({ fileKey: serialKey, targetKey: targetFolderKey })
          //    .then(() => {
          //      queryClient.invalidateQueries({
          //        queryKey: generateQueryKey('folder', targetFolderKey),
          //      });
          //      queryClient.invalidateQueries({
          //        queryKey: generateQueryKey('folder', info.parentKey),
          //      });
          //    });
          //}
        });
      }
    },
    [
      currentWindow,
      findWindow,
      isDragging,
      isFileKeySelected,
      pointerMoved,
      selectedFileSerials,
    ],
  );

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
