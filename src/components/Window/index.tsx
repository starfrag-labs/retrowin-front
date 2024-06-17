import { useEffect, useRef } from 'react';
import { useElementStore } from '../../store/element.store';
import { useWindowStore } from '../../store/window.store';
import { windowContainer, windowContent, windowHeader } from '../../styles/window.css';
import { Navigator } from './Navigator';
import { Uploader } from './Uploader';
import { useRefStore } from '../../store/ref.store';

export const Window = ({ windowKey }: { windowKey: string }) => {
  const window = useWindowStore((state) => state.findWindow(windowKey));
  const windowSize = useRef({ width: 0, height: 0 });
  const windowPosition = useRef({ x: 0, y: 0 });
  const windowContainerRef = useRef<HTMLDivElement>(null);
  const windowHeaderRef = useRef<HTMLDivElement>(null);
  const windowContentRef = useRef<HTMLDivElement>(null);
  const element = useElementStore((state) => state.findElement(windowKey));
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const setWindowRef = useRefStore((state) => state.setWindowRef);

  useEffect(() => {
    if (windowContentRef.current) {
      setWindowRef(windowKey, windowContentRef);
    }
  }, [setWindowRef, windowKey]);

  useEffect(() => {
    if (windowContainerRef.current) {
      const width = document.body.clientWidth / 2;
      const height = document.body.clientHeight / 2;
      const x = document.body.clientWidth / 2 - width / 2;
      const y = document.body.clientHeight / 2 - height / 2;
      windowSize.current = { width, height };
      windowPosition.current = { x, y };
    }
  }, []);

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

  const handleMouseDown = (e: React.MouseEvent) => {
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

  if (!window) return null;

  return (
    <div className={windowContainer} ref={windowContainerRef}>
      <div
        className={windowHeader}
        ref={windowHeaderRef}
        onMouseDown={handleMouseDown}
      >
        {element?.name || 'Window'}
        <button onClick={() => closeWindow(window.key)}>X</button>
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
