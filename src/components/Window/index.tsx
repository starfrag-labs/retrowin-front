import { useCallback, useEffect, useRef, useState } from 'react';
import {
  windowContainer,
  windowHeader,
  closeBtn,
  windowContent,
  maximizeBtn,
  btnContainer,
  minimizeBtn,
  navigatorArrowContainer,
  windowHeaderLeft,
  navigatorArrowDisabled,
  navigatorArrow,
} from '../../styles/windows/window.css';
import { useEventStore } from '../../store/event.store';
import { useWindowStore } from '../../store/window.store';
import { VideoViewer } from './VideoViewer';
import { ImageViewer } from './ImageViewer';
import { Uploader } from './Uploader';
import { Navigator } from './Navigator';
import { MdNavigateBefore } from 'react-icons/md';
import { MdNavigateNext } from 'react-icons/md';
import { CircularLoading } from '../CircularLoading';
import { useElementStore } from '../../store/element.store';

export const WindowV2 = ({
  windowKey,
}: {
  windowKey: string;
}): React.ReactElement => {
  // Minimum size of window
  const minWidth = 400;
  const minHeight = 200;

  // states
  const [title, setTitle] = useState('Window');
  const [maximized, setMaximized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [window, setWindow] = useState(
    useWindowStore.getState().findWindow(windowKey)
  );

  // refs
  const windowSize = useRef({ width: 0, height: 0 });
  const windowPosition = useRef({ x: 0, y: 0 });
  const windowContainerRef = useRef<HTMLDivElement>(null);
  const windowHeaderRef = useRef<HTMLDivElement>(null);
  const windowContentRef = useRef<HTMLDivElement>(null);

  // store states
  const windows = useWindowStore((state) => state.windows);
  const resizing = useEventStore((state) => state.resizing);

  // store functions
  const findWindow = useWindowStore((state) => state.findWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const setResizing = useEventStore((state) => state.setResizing);
  const highlightWindow = useWindowStore((state) => state.highlightWindow);
  const prevWindow = useWindowStore((state) => state.prevWindow);
  const nextWindow = useWindowStore((state) => state.nextWindow);
  const getElementInfo = useElementStore((state) => state.getElementInfo);
  const setCurrentWindow = useWindowStore((state) => state.setCurrentWindow);

  // set current window effect
  const onMouseEnter = useCallback(() => {
    setCurrentWindow({ key: windowKey, ref: windowContentRef });
  }, [setCurrentWindow, windowKey, windowContentRef]);

  // reset current window effect
  const onMouseLeave = useCallback(() => {
    setCurrentWindow(null);
  }, [setCurrentWindow]);

  // update window state
  useEffect(() => {
    const window = findWindow(windowKey);
    if (window) {
      setWindow(window);
    }
  }, [findWindow, windowKey, windows]);

  // set window title
  useEffect(() => {
    const window = findWindow(windowKey);
    if (window) {
      const info = getElementInfo(window.targetKey);
      if (info && info.name) {
        setTitle(info.name);
      } else if (window.type === 'uploader') {
        setTitle('Upload Files');
      }
    }
  }, [getElementInfo, findWindow, windowKey, windows]);

  // initialize window size and position
  useEffect(() => {
    const window = findWindow(windowKey);
    if (windowContainerRef.current && window) {
      if (window.type === 'uploader') {
        const width = Math.max(document.body.clientWidth / 2.5, minWidth);
        const height = Math.max(document.body.clientHeight / 2.5, minHeight);
        const x = document.body.clientWidth / 2 - width / 2;
        const y = document.body.clientHeight / 2 - height / 2;
        windowSize.current = { width, height };
        windowPosition.current = { x, y };
        return;
      } else {
        const width = document.body.clientWidth / 2;
        const height = document.body.clientHeight / 2;
        const x = document.body.clientWidth / 2 - width / 2;
        const y = document.body.clientHeight / 2 - height / 2;
        windowSize.current = { width, height };
        windowPosition.current = { x, y };
      }
    }
  }, [findWindow, window, windowKey]);

  // set window size and position
  useEffect(() => {
    if (windowContainerRef.current) {
      windowContainerRef.current.style.width = `${windowSize.current.width}px`;
      windowContainerRef.current.style.height = `${windowSize.current.height}px`;
      windowContainerRef.current.style.left = `${windowPosition.current.x}px`;
      windowContainerRef.current.style.top = `${windowPosition.current.y}px`;
    }
    if (windowContentRef.current && windowHeaderRef.current) {
      windowContentRef.current.style.width = `${windowSize.current.width}px`;
      windowContentRef.current.style.height = `${windowSize.current.height - windowHeaderRef.current.clientHeight}px`;
    }
  }, []);

  // maximize window
  const maximizeWindow = () => {
    if (
      !windowContainerRef.current ||
      !windowContentRef.current ||
      !windowHeaderRef.current
    )
      return;
    setMaximized(true);
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    windowContainerRef.current.style.left = '0px';
    windowContainerRef.current.style.top = '0px';
    windowContainerRef.current.style.width = `${width}px`;
    windowContainerRef.current.style.height = `${height}px`;
    windowContentRef.current.style.width = `${width}px`;
    windowContentRef.current.style.height = `${height - windowHeaderRef.current.clientHeight}px`;
  };

  // revert window size
  const revertWindowSize = () => {
    if (
      !windowContainerRef.current ||
      !windowContentRef.current ||
      !windowHeaderRef.current
    )
      return;
    setMaximized(false);
    windowContainerRef.current.style.width = `${windowSize.current.width}px`;
    windowContainerRef.current.style.height = `${windowSize.current.height}px`;
    windowContainerRef.current.style.left = `${windowPosition.current.x}px`;
    windowContainerRef.current.style.top = `${windowPosition.current.y}px`;
    windowContentRef.current.style.width = `${windowSize.current.width}px`;
    windowContentRef.current.style.height = `${windowSize.current.height - windowHeaderRef.current.clientHeight}px`;
  };

  // move window
  const moveWindow = (e: React.MouseEvent) => {
    if (!windowContainerRef.current || !windowHeaderRef.current) return;
    if (e.clientX < 0 || e.clientY < 0) return;
    if (
      e.clientX > document.body.clientWidth ||
      e.clientY > document.body.clientHeight
    )
      return;
    const rect = windowHeaderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const handleMouseMove = (e: MouseEvent) => {
      if (!windowContainerRef.current) return;
      windowContainerRef.current.style.left = `${e.clientX - x}px`;
      windowContainerRef.current.style.top = `${e.clientY - y}px`;
    };
    const handleMouseUp = () => {
      // correct window position
      if (!windowContainerRef.current) return;
      const rect = windowContainerRef.current.getBoundingClientRect();
      const x = rect.left;
      const y = rect.top;
      if (x < 0) windowContainerRef.current.style.left = '0px';
      if (y < 0) windowContainerRef.current.style.top = '0px';
      if (x + rect.width > document.body.clientWidth)
        windowContainerRef.current.style.left = `${document.body.clientWidth - rect.width}px`;
      if (y + rect.height > document.body.clientHeight)
        windowContainerRef.current.style.top = `${document.body.clientHeight - rect.height}px`;

      // remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // change cursor on resize
  const changeCursor = useCallback(
    (e: MouseEvent) => {
      if (!windowContainerRef.current) return;
      const rect = windowContainerRef.current.getBoundingClientRect();
      if (e.clientX > rect.right - 10 && e.clientY > rect.bottom - 10) {
        setResizing(true);
        windowContainerRef.current.style.cursor = 'nwse-resize';
      } else if (resizing) {
        setResizing(false);
        windowContainerRef.current.style.cursor = 'default';
      }
    },
    [resizing, setResizing]
  );

  useEffect(() => {
    const currentWindow = windowContainerRef.current;
    if (!currentWindow) return;
    currentWindow.addEventListener('mousemove', changeCursor);
    return () => {
      currentWindow.removeEventListener('mousemove', changeCursor);
    };
  }, [changeCursor]);

  const startResizing = useCallback(
    (e: MouseEvent) => {
      if (!windowContainerRef.current) return;
      const rect = windowContainerRef.current.getBoundingClientRect();
      if (
        resizing &&
        e.clientX > rect.right - 10 &&
        e.clientY > rect.bottom - 10
      ) {
        const handleMouseMove = (e: MouseEvent) => {
          if (
            !windowContainerRef.current ||
            !windowContentRef.current ||
            !windowHeaderRef.current
          )
            return;
          const width = Math.max(e.clientX - rect.left, minWidth);
          const height = Math.max(e.clientY - rect.top, minHeight);
          windowContainerRef.current.style.width = `${width}px`;
          windowContainerRef.current.style.height = `${height}px`;
          windowContentRef.current.style.width = `${width}px`;
          windowContentRef.current.style.height = `${height - windowHeaderRef.current.clientHeight}px`;
        };
        const handleMouseUp = () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    },
    [resizing]
  );

  // resize window start
  useEffect(() => {
    const currentWindow = windowContainerRef.current;
    if (!currentWindow) return;
    currentWindow.addEventListener('mousedown', startResizing);
    return () => {
      currentWindow.removeEventListener('mousedown', startResizing);
    };
  }, [startResizing]);

  // set window title
  useEffect(() => {
    const info = getElementInfo(window?.targetKey ?? '');
    if (info && info.name) {
      setTitle(info.name);
    } else if (window && window.type === 'uploader') {
      setTitle('Upload Files');
    }
  }, [getElementInfo, window]);

  // handle mouse down event on window
  const handleMouseDown = () => {
    // highlight window on click
    if (window) {
      highlightWindow(window.key);
    }
  };

  if (!window) return <></>;

  return (
    <div
      className={windowContainer}
      ref={windowContainerRef}
      onMouseDown={handleMouseDown}
    >
      <div
        className={windowHeader}
        ref={windowHeaderRef}
        onMouseDown={moveWindow}
      >
        <div className={windowHeaderLeft}>
          {window.type === 'navigator' &&
            window.historyIndex !== undefined &&
            window.targetHistory !== undefined && (
              <div className={navigatorArrowContainer}>
                <MdNavigateBefore
                  className={
                    window.historyIndex === 0
                      ? navigatorArrowDisabled
                      : navigatorArrow
                  }
                  onClick={() => {
                    prevWindow(window.key);
                  }}
                />
                <MdNavigateNext
                  className={
                    window.historyIndex === window.targetHistory.length - 1
                      ? navigatorArrowDisabled
                      : navigatorArrow
                  }
                  onClick={() => {
                    nextWindow(window.key);
                  }}
                />
              </div>
            )}
          {title}
          {window.type === 'navigator' && loading && (
            <CircularLoading size="1rem" border="3px" />
          )}
        </div>
        <div className={btnContainer}>
          {maximized ? (
            <button onClick={revertWindowSize} className={minimizeBtn} />
          ) : (
            <button onClick={maximizeWindow} className={maximizeBtn} />
          )}
          <button
            onClick={() => closeWindow(window.key)}
            className={closeBtn}
          />
        </div>
      </div>
      <div
        className={windowContent}
        ref={windowContentRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {window.type === 'image' ? (
          <ImageViewer fileKey={window.targetKey} setTitle={setTitle} />
        ) : window.type === 'video' ? (
          <VideoViewer fileKey={window.targetKey} />
        ) : window.type === 'navigator' ? (
          <Navigator folderKey={window.targetKey} setLoading={setLoading} />
        ) : window.type === 'uploader' ? (
          <Uploader folderKey={window.targetKey.split('_')[0]} />
        ) : null}
      </div>
    </div>
  );
};
