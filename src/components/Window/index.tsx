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
  maximizeBtn,
  btnContainer,
  minimizeBtn,
} from '../../styles/windows/window.css';
import { ImageReader } from './ImageReader';
import { VideoPlayer } from './VideoPlayer';
import { useEventStore } from '../../store/event.store';

export const Window = ({ windowKey }: { windowKey: string }) => {
  // states
  const [title, setTitle] = useState('Window');
  const [maximized, setMaximized] = useState(false);

  // refs
  const windowSize = useRef({ width: 0, height: 0 });
  const windowPosition = useRef({ x: 0, y: 0 });
  const windowContainerRef = useRef<HTMLDivElement>(null);

  // store states
  const window = useWindowStore((state) => state.findWindow(windowKey));
  const windowHeaderRef = useRef<HTMLDivElement>(null);
  const windowContentRef = useRef<HTMLDivElement>(null);
  const element = useElementStore((state) => state.findElement(windowKey));
  const resizing = useEventStore((state) => state.resizing);

  // store functions
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const setWindowRef = useRefStore((state) => state.setWindowRef);
  const setResizing = useEventStore((state) => state.setResizing);

  // update ref store on mount
  useEffect(() => {
    if (windowContentRef.current) {
      setWindowRef(windowKey, windowContentRef);
    }
  }, [setWindowRef, windowKey]);

  // initialize window size and position
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
    if (!windowContainerRef.current) return;
    setMaximized(true);
    windowContainerRef.current.style.width = `${document.body.clientWidth}px`;
    windowContainerRef.current.style.height = `${document.body.clientHeight}px`;
    windowContainerRef.current.style.left = '0px';
    windowContainerRef.current.style.top = '0px';
  }

  // minimize window
  const minimizeWindow = () => {
    if (!windowContainerRef.current) return;
    setMaximized(false);
    windowContainerRef.current.style.width = `${windowSize.current.width}px`;
    windowContainerRef.current.style.height = `${windowSize.current.height}px`;
    windowContainerRef.current.style.left = `${windowPosition.current.x}px`;
    windowContainerRef.current.style.top = `${windowPosition.current.y}px`;
  }

  // move window
  const moveWindow = (e: React.MouseEvent) => {
    if (!windowContainerRef.current || !windowHeaderRef.current) return;
    if (e.clientX < 0 || e.clientY < 0) return;
    if (e.clientX > document.body.clientWidth || e.clientY > document.body.clientHeight) return;
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
        <div className={btnContainer}>
          {maximized ? ( 
            <button onClick={minimizeWindow} className={minimizeBtn} />
          ) : (
            <button onClick={maximizeWindow} className={maximizeBtn} />
          )}
          <button onClick={() => closeWindow(window.key)} className={closeBtn} />
        </div>
      </div>
      <div className={windowContent} ref={windowContentRef}>
        {window.type === 'image' ? (
          <ImageReader fileKey={window.key} setTitle={setTitle}/>
        ) : window.type === 'video' ? (
          <VideoPlayer fileKey={window.key} />
        ) : window.type === 'navigator' ? (
          <Navigator folderKey={window.key} />
        ) : window.type === 'uploader' ? (
          <Uploader folderKey={window.key.split('_')[0]} />
        ) : null}
      </div>
    </div>
  );
};
