import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./window.module.css";
import WindowContent from "./window_content";
import WindowHeader from "./window_header";
import { AppWindow } from "@/interfaces/window";
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
  const [title, setTitle] = useState("Window");
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
  const resizing = useEventStore((state) => state.resizing);
  // Store actions
  const findWindow = useWindowStore((state) => state.findWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const setResizing = useEventStore((state) => state.setResizing);
  const highlightWindow = useWindowStore((state) => state.highlightWindow);
  const prevWindow = useWindowStore((state) => state.prevWindow);
  const nextWindow = useWindowStore((state) => state.nextWindow);
  const setCurrentWindow = useWindowStore((state) => state.setCurrentWindow);
  const setMouseEnter = useWindowStore((state) => state.setMouseEnter);

  // Refs
  const windowRef = useRef<HTMLDivElement>(null);
  const windowHeaderRef = useRef<HTMLDivElement>(null);
  const windowContentRef = useRef<HTMLDivElement>(null);

  // Queries
  //const fileInfo = useQuery(fileQuery.read.info(targetWindow?.targetKey || ""));

  // Set window title
  useEffect(() => {
    if (targetWindow?.type === "uploader") {
      setTitle("Uploader");
      //} else if (fileInfo.isSuccess) {
    } else {
      //setTitle(fileInfo.data.data.fileName);
      setTitle("File");
    }
    //}, [fileInfo.data, fileInfo.isSuccess, targetWindow?.type]);
  }, [targetWindow?.type]);

  // Set current window
  const enterWindow = useCallback(() => {
    setCurrentWindow({
      key: windowKey,
      windowRef,
      contentRef: windowContentRef,
      headerRef: windowHeaderRef,
    });
  }, [setCurrentWindow, windowKey]);

  // Leave window
  const leaveWindow = useCallback(() => {
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
      if (targetWindow.type === "uploader") {
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
        !resizing
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
            // Check if the window is out of the screen
            // If x or y is less than 0, set it to 0
            if (x < 0) {
              setWindowPosition({ x: 0, y });
            }
            if (y < 0) {
              setWindowPosition({ x, y: 0 });
            }
            // If x or y is greater than the screen width or height, set it to the screen width or height
            if (x + windowSize.width > document.body.clientWidth) {
              setWindowPosition({
                x: document.body.clientWidth - windowSize.width,
                y,
              });
            }
            if (y + windowSize.height > document.body.clientHeight) {
              setWindowPosition({
                x,
                y: document.body.clientHeight - windowSize.height,
              });
            }
          }
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }
    },
    [resizing, windowSize.height, windowSize.width],
  );

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
        title={title}
        prevWindowButtonAction={() => prevWindow(windowKey)}
        nextWindowButtonAction={() => nextWindow(windowKey)}
        firstWindowButtonAction={maximized ? revertWindowSize : maximizeWindow}
        secondWindowButtonAction={() => closeWindow(windowKey)}
        windowButtonColorPallete={
          maximized
            ? maximizedWindowButtonColorPallete
            : defaultWindowButtonColorPallete
        }
      />
      <WindowContent
        fileKey={targetWindow?.targetKey || ""}
        windowKey={windowKey}
        setLoading={setContentLoading}
        type={targetWindow?.type || "other"}
        ref={windowContentRef}
        onMouseEnter={enterWindow}
        onMouseLeave={leaveWindow}
      />
    </div>
  );
});
