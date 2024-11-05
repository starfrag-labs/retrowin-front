import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./window.module.css";
import WindowContent from "./window_content";
import WindowHeader from "./window_header";
import { AppWindow, WindowType } from "@/interfaces/window";
import { useWindowStore } from "@/store/window.store";
import { useEventStore } from "@/store/event.store";
import { fileQuery } from "@/api/query";
import { useQuery } from "@tanstack/react-query";

export default memo(function Window({ windowKey }: { windowKey: string }) {
  // Constants
  const minWindowSize = useMemo(() => ({ width: 400, height: 200 }), []); // Minimum window size
  const windowSize1 = useMemo(() => ({ width: 800, height: 400 }), []); // Large window size
  const windowSize2 = useMemo(() => ({ width: 600, height: 300 }), []); // Medium window size

  // States
  const [maximized, setMaximized] = useState(false);
  const [targetWindow, setTargetWindow] = useState<AppWindow | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [prevWindowSize, setPrevWindowSize] = useState({ width: 0, height: 0 });
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [prevWindowPosition, setPrevWindowPosition] = useState({ x: 0, y: 0 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [defaultWindowButtonColorPallete, setDefaultWindowButtonColorPallete] =
    useState(["#C8E6C9", "#FFCDD2", "#FFE0B2"]);
  const [
    maximizedWindowButtonColorPallete,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setMaximizedWindowButtonColorPallete,
  ] = useState(["#FFE0B2", "#FFCDD2", "#FFE0B2"]);
  const [contentLoading, setContentLoading] = useState(false);

  // Store state
  const windows = useWindowStore((state) => state.windows);
  const resizingCursor = useEventStore((state) => state.resizingCursor);
  // Store actions
  const findWindow = useWindowStore((state) => state.findWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const setResizingCursor = useEventStore((state) => state.setResizingCursor);
  const highlightWindow = useWindowStore((state) => state.highlightWindow);
  const prevWindow = useWindowStore((state) => state.prevWindow);
  const nextWindow = useWindowStore((state) => state.nextWindow);
  const setCurrentWindow = useWindowStore((state) => state.setCurrentWindow);
  const setMouseEnter = useWindowStore((state) => state.setMouseEnter);
  const setTitle = useWindowStore((state) => state.setTitle);

  // Refs
  const windowRef = useRef<HTMLDivElement>(null);
  const windowHeaderRef = useRef<HTMLDivElement>(null);
  const windowContentRef = useRef<HTMLDivElement>(null);

  // Queries
  const fileInfo = useQuery(fileQuery.read.info(targetWindow?.targetKey || ""));

  // Set window title
  useEffect(() => {
    if (targetWindow?.type === WindowType.Uploader) {
      setTitle(windowKey, "Uploader");
    } else if (fileInfo.isSuccess) {
      setTitle(windowKey, fileInfo.data.data.fileName);
    }
  }, [
    fileInfo.data,
    fileInfo.isSuccess,
    setTitle,
    targetWindow?.type,
    windowKey,
  ]);

  // Set current window
  const enterWindow = useCallback(() => {
    setCurrentWindow({
      key: windowKey,
      windowRef,
      contentRef: windowContentRef,
      headerRef: windowHeaderRef,
    });
  }, [setCurrentWindow, windowKey]);

  // Set current window to null when the mouse enters the window header
  const enterWindowHeader = useCallback(() => {
    setCurrentWindow(null);
  }, [setCurrentWindow]);

  // Update window state
  useEffect(() => {
    const window = findWindow(windowKey);
    if (window) {
      setTargetWindow(window);
    }
  }, [findWindow, windowKey, windows]);

  // Initialize window position and size
  useEffect(() => {
    if (windowRef.current && targetWindow) {
      if (targetWindow.type === WindowType.Uploader) {
        const x = document.body.clientWidth / 2 - windowSize1.width / 2;
        const y = document.body.clientHeight / 2 - windowSize1.height / 2;
        setWindowPosition({ x, y });
        setWindowSize(windowSize1);
      } else {
        const x = document.body.clientWidth / 2 - windowSize2.width / 2;
        const y = document.body.clientHeight / 2 - windowSize2.height / 2;
        setWindowPosition({ x, y });
        setWindowSize(windowSize2);
      }
    }
  }, [targetWindow, windowSize1, windowSize2]);

  // Set window size
  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.style.width = `${windowSize.width}px`;
      windowRef.current.style.height = `${windowSize.height}px`;
    }
  }, [windowSize]);

  // Set window position
  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.style.left = `${windowPosition.x}px`;
      windowRef.current.style.top = `${windowPosition.y}px`;
    }
  }, [windowPosition]);

  // Maximize window
  const maximizeWindow = useCallback(() => {
    setPrevWindowSize(windowSize);
    setPrevWindowPosition(windowPosition);
    setWindowSize({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    });
    setWindowPosition({ x: 0, y: 0 });
    setMaximized(true);
  }, [windowPosition, windowSize]);

  // Revert window size
  const revertWindowSize = useCallback(() => {
    setWindowSize(prevWindowSize);
    setWindowPosition(prevWindowPosition);
    setMaximized(false);
  }, [prevWindowSize, prevWindowPosition]);

  // Move window
  const moveWindow = useCallback(
    (e: React.MouseEvent) => {
      if (
        windowRef.current &&
        windowHeaderRef.current &&
        e.clientX > 0 &&
        e.clientY > 0 &&
        !resizingCursor
      ) {
        const headerRect = windowHeaderRef.current.getBoundingClientRect();
        const x = e.clientX - headerRect.left;
        const y = e.clientY - headerRect.top;
        // Set window position
        const handleMouseMove = (e: MouseEvent) => {
          if (windowRef.current) {
            setWindowPosition({
              x: e.clientX - x,
              y: e.clientY - y,
            });
          }
        };
        // Handle mouse move
        const handleMouseUp = () => {
          if (windowRef.current) {
            const windowRect = windowRef.current.getBoundingClientRect();
            const x = windowRect.left;
            const y = windowRect.top;
            let newX = x;
            let newY = y;
            // Check if the window is out of the screen
            // If x or y is less than 0, set it to 0
            if (x < 0) {
              newX = 0;
            }
            if (y < 0) {
              newY = 0;
            }
            // If x or y is greater than the screen width or height, set it to the screen width or height
            if (x + windowSize.width > document.body.clientWidth) {
              newX = document.body.clientWidth - windowSize.width;
            }
            if (y + windowSize.height > document.body.clientHeight) {
              newY = document.body.clientHeight - windowSize.height;
            }
            // Set window position
            setWindowPosition({ x: newX, y: newY });
          }
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }
    },
    [resizingCursor, windowSize.height, windowSize.width],
  );

  // change cursor on resize
  const changeCursor = useCallback(
    (e: MouseEvent) => {
      if (!windowRef.current) return;
      const rect = windowRef.current.getBoundingClientRect();
      if (e.clientX > rect.right - 10 && e.clientY > rect.bottom - 10) {
        setResizingCursor(true);
        windowRef.current.style.cursor = "nwse-resize";
      } else {
        setResizingCursor(false);
        windowRef.current.style.cursor = "default";
      }
    },
    [setResizingCursor],
  );
  useEffect(() => {
    const currentWindow = windowRef.current;
    if (!currentWindow) return;
    currentWindow.addEventListener("mousemove", changeCursor);
    return () => {
      currentWindow.removeEventListener("mousemove", changeCursor);
    };
  }, [changeCursor]);

  // Resize window
  const resizeWindow = useCallback(
    (e: MouseEvent) => {
      if (!windowRef.current) return;
      const rect = windowRef.current.getBoundingClientRect();
      if (
        resizingCursor &&
        e.clientX > rect.right - 10 &&
        e.clientY > rect.bottom - 10
      ) {
        const handleMouseMove = (e: MouseEvent) => {
          const width = Math.max(e.clientX - rect.left, minWindowSize.width);
          const height = Math.max(e.clientY - rect.top, minWindowSize.height);
          setWindowSize({ width, height });
        };
        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    },
    [minWindowSize.width, minWindowSize.height, resizingCursor],
  );
  useEffect(() => {
    const currentWindow = windowRef.current;
    if (!currentWindow) return;
    currentWindow.addEventListener("mousedown", resizeWindow);
    return () => {
      currentWindow.removeEventListener("mousedown", resizeWindow);
    };
  }, [resizeWindow]);

  return (
    <div
      className={`flex-center ${styles.container}`}
      ref={windowRef}
      onMouseDown={() => highlightWindow(windowKey)}
      onMouseEnter={() => setMouseEnter(true)} // Set mouse enter when the mouse enters the window
      onMouseLeave={() => setMouseEnter(false)} // Set mouse enter when the mouse leaves the window
    >
      <WindowHeader
        ref={windowHeaderRef}
        onMouseDown={moveWindow}
        loading={contentLoading}
        title={targetWindow?.title || ""}
        prevWindowButtonAction={() => prevWindow(windowKey)}
        nextWindowButtonAction={() => nextWindow(windowKey)}
        firstWindowButtonAction={maximized ? revertWindowSize : maximizeWindow}
        secondWindowButtonAction={() => closeWindow(windowKey)}
        windowButtonColorPallete={
          maximized
            ? maximizedWindowButtonColorPallete
            : defaultWindowButtonColorPallete
        }
        onMouseEnter={enterWindowHeader}
      />
      {targetWindow && (
        <WindowContent
          fileKey={targetWindow.targetKey}
          fileName={fileInfo.data?.data.fileName || ""}
          windowKey={windowKey}
          setLoading={setContentLoading}
          type={targetWindow.type}
          ref={windowContentRef}
          onMouseEnter={enterWindow}
        />
      )}
    </div>
  );
});
