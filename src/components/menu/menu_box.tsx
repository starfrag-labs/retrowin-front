import { useEventStore } from "@/store/event.store";
import { useFileStore } from "@/store/file.store";
import { useMenuStore } from "@/store/menu.store";
import { useWindowStore } from "@/store/window.store";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./menu_box.module.css";
import BackgroundMenu from "./background_menu";
import FileMenu from "./file_menu";
import { FileType } from "@/interfaces/api";
import WindowMenu from "./window_menu";

export default function MenuBox({ children }: { children: React.ReactNode }) {
  // States
  const [menuType, setMenuType] = useState<
    "file" | "window" | "background" | null
  >(null);

  // Refs
  const menuRef = useRef<HTMLDivElement>(null);

  // Store states
  const mouseEnterWindow = useWindowStore((state) => state.mouseEnter);
  const currentWindow = useWindowStore((state) => state.currentWindow);
  const highlightedFile = useFileStore((state) => state.highlightedFile);
  const pressedKeys = useEventStore((state) => state.pressedKeys);
  // Store actions
  const setMenuRef = useMenuStore((state) => state.setMenuRef);
  const selectFile = useFileStore((state) => state.selectFile);
  const isFileKeySelected = useFileStore((state) => state.isFileKeySelected);
  const unselectAllFiles = useFileStore((state) => state.unselectAllFiles);

  // States
  const [targetFile, setTargetFile] = useState<{
    fileKey: string;
    fileName: string;
    fileType: FileType;
  } | null>(null);
  const [targetWindowKey, setTargetWindowKey] = useState<string | null>(null);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      const currentMenuRef = menuRef.current;
      if (currentMenuRef) {
        e.preventDefault();
        currentMenuRef.style.left = `${e.clientX}px`;
        currentMenuRef.style.top = `${e.clientY}px`;
        // Set menu type to background by default
        setMenuType("background");
      }
      if (mouseEnterWindow && currentWindow) {
        setTargetWindowKey(currentWindow.key);
        setMenuType("window");
      }
      if (highlightedFile) {
        if (
          !pressedKeys.includes("Shift") &&
          !isFileKeySelected(highlightedFile.fileKey)
        ) {
          unselectAllFiles();
        }
        setTargetFile({
          fileKey: highlightedFile.fileKey,
          fileName: highlightedFile.fileName,
          fileType: highlightedFile.type,
        });
        setMenuType("file");
      }
    },
    [
      currentWindow,
      highlightedFile,
      isFileKeySelected,
      mouseEnterWindow,
      pressedKeys,
      unselectAllFiles,
    ],
  );

  const closeMenu = useCallback(() => {
    setMenuType(null);
    setTargetFile(null);
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.button === 0) {
        const currentMenuRef = menuRef.current;
        if (
          currentMenuRef &&
          e.target !== currentMenuRef &&
          !currentMenuRef.contains(e.target as Node)
        ) {
          closeMenu();
        }
      }
    },
    [closeMenu],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleMouseDown]);

  useEffect(() => {
    if (menuRef.current) {
      setMenuRef(menuRef);
    }
  }, [setMenuRef]);

  return (
    <div className="flex-center full-size" onContextMenu={handleContextMenu}>
      <div className={styles.menu_box} ref={menuRef} hidden={menuType === null}>
        {menuType === "background" && <BackgroundMenu closeMenu={closeMenu} />}
        {menuType === "file" && targetFile && (
          <FileMenu
            fileKey={targetFile.fileKey}
            fileName={targetFile.fileName}
            fileType={targetFile.fileType}
            closeMenu={closeMenu}
          />
        )}
        {menuType === "window" && targetWindowKey && (
          <WindowMenu windowKey={targetWindowKey} closeMenu={closeMenu} />
        )}
      </div>
      {children}
    </div>
  );
}
