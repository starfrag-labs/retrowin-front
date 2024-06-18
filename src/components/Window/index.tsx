import { useCallback, useEffect, useRef, useState } from 'react';
import { useElementStore } from '../../store/element.store';
import { useWindowStore } from '../../store/window.store';
import { Navigator } from './Navigator';
import { Uploader } from './Uploader';
import { useRefStore } from '../../store/ref.store';
import {
  windowContainer,
  windowHeader,
  closeBtn,
  windowContent,
} from '../../styles/windows/window.css';

export const Window = ({ windowKey }: { windowKey: string }) => {
  const [title, setTitle] = useState('Window');
  const window = useWindowStore((state) => state.findWindow(windowKey));
  const windowSize = useRef({ width: 0, height: 0 });
  const windowPosition = useRef({ x: 0, y: 0 });
  const windowContainerRef = useRef<HTMLDivElement>(null);
  const windowHeaderRef = useRef<HTMLDivElement>(null);
  const windowContentRef = useRef<HTMLDivElement>(null);
  const element = useElementStore((state) => state.findElement(windowKey));
  const readyResizing = useWindowStore((state) => state.readyResizing);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const setWindowRef = useRefStore((state) => state.setWindowRef);
  const setReadyResizing = useWindowStore((state) => state.setReadyResizing);

  useEffect(() => {
    if (windowContentRef.current) {
      setWindowRef(windowKey, windowContentRef);
    }
  }, [setWindowRef, windowKey]);

  useEffect(() => {
    if (windowContainerRef.current && window) {
      if (window.type === 'uploader') {
        const width = document.body.clientWidth / 2.5;
        const height = document.body.clientHeight / 2.5;
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
  }, [window]);

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

  const moveWindow = (e: React.MouseEvent) => {
    if (!windowContainerRef.current || !windowHeaderRef.current) return;
    const rect = windowHeaderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const handleMouseMove = (e: MouseEvent) => {
      if (!windowContainerRef.current) return;
      windowContainerRef.current.style.left = `${e.clientX - x}px`;
      windowContainerRef.current.style.top = `${e.clientY - y}px`;
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const changeCursor = useCallback(
    (e: MouseEvent) => {
      if (!windowContainerRef.current) return;
      const rect = windowContainerRef.current.getBoundingClientRect();
      if (e.clientX > rect.right - 10 && e.clientY > rect.bottom - 10) {
        setReadyResizing(true);
        windowContainerRef.current.style.cursor = 'nwse-resize';
      } else if (readyResizing) {
        setReadyResizing(false);
        windowContainerRef.current.style.cursor = 'default';
      }
    },
    [readyResizing, setReadyResizing]
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
        readyResizing &&
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
          const width = e.clientX - rect.left;
          const height = e.clientY - rect.top;
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
    [readyResizing]
  );

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
    if (element && element.name) {
      setTitle(element.name);
    } else if (window && window.type === 'uploader') {
      setTitle('Upload Files');
    }
  }, [element, window]);
  
  if (!window) return null;

  return (
    <div className={windowContainer} ref={windowContainerRef}>
      <div
        className={windowHeader}
        ref={windowHeaderRef}
        onMouseDown={moveWindow}
      >
        {title}
        <button onClick={() => closeWindow(window.key)} className={closeBtn} />
      </div>
      <div className={windowContent} ref={windowContentRef}>
        {window.type === 'navigator' ? (
          <Navigator folderKey={window.key} />
        ) : window.type === 'uploader' ? (
          <Uploader folderKey={window.key} />
        ) : null}
      </div>
    </div>
  );
};
