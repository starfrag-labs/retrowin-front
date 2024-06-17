import { useCallback, useRef, useState } from 'react';
import { draggingElementsIcon } from '../styles/element.css';
import { selectBox, selector } from '../styles/selector.css';
import { useRefStore } from '../store/ref.store';
import { useElementStore } from '../store/element.store';

export const AdvancedSelector = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const selectorRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const elements = useElementStore((state) => state.elements);
  const selectElement = useElementStore((state) => state.selectElement);
  const unselectElement = useElementStore((state) => state.unselectElement);
  const unselectAllElements = useElementStore(
    (state) => state.unselectAllElements
  );
  const findElement = useElementStore((state) => state.findElement);

  const windowsRef = useRefStore((state) => state.windowsRef);
  const elementsRef = useRefStore((state) => state.elementsRef);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!selectorRef.current || !boxRef.current) return;
      const x = e.clientX;
      const y = e.clientY;

      let targetWindow: HTMLElement | null = null;
      if (windowsRef) {
        windowsRef.forEach((window) => {
          if (window.current && window.current.contains(e.target as Node)) {
            targetWindow = window.current;
          }
        });
      }

      // display the box
      boxRef.current.style.left = `${x}px`;
      boxRef.current.style.top = `${y}px`;
      boxRef.current.style.width = '0px';
      boxRef.current.style.height = '0px';

      const checkElementsInBox = () => {
        if (!elementsRef || !boxRef.current) return;

        const boxRect = boxRef.current.getBoundingClientRect();
        elementsRef.forEach((element, key) => {
          if (!element.current) return;
          const elementRect = element.current.getBoundingClientRect();
          if (
            boxRect.left < elementRect.right &&
            boxRect.right > elementRect.left &&
            boxRect.top < elementRect.bottom &&
            boxRect.bottom > elementRect.top
          ) {
            selectElement(key);
          } else {
            unselectElement(key);
          }
        });
      };

      // mouse move handler
      const handleMouseMove = (e: MouseEvent) => {
        if (e.buttons !== 1) return;

        const targetWindowRect =
          targetWindow?.getBoundingClientRect() ||
          document.body.getBoundingClientRect();
        if (!selectorRef.current || !boxRef.current) return;

        const left = Math.max(
          Math.min(x, e.clientX),
          targetWindowRect.left + 1
        );
        const top = Math.max(Math.min(y, e.clientY), targetWindowRect.top + 1);
        const right = Math.min(
          Math.max(x, e.clientX),
          targetWindowRect.right - 3
        );
        const bottom = Math.min(
          Math.max(y, e.clientY),
          targetWindowRect.bottom - 3
        );
        const width = right - left;
        const height = bottom - top;

        boxRef.current.style.left = `${left}px`;
        boxRef.current.style.top = `${top}px`;
        boxRef.current.style.width = `${width}px`;
        boxRef.current.style.height = `${height}px`;
        boxRef.current.style.display = 'block';

        checkElementsInBox();
      };

      // mouse up handler
      const handleMouseUp = () => {
        if (!boxRef.current) return;
        boxRef.current.style.display = 'none';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      // add event listeners
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [elementsRef, selectElement, unselectElement, windowsRef]
  );

  return (
    <div className={selector} ref={selectorRef} onMouseDown={handleMouseDown}>
      <div className={selectBox} ref={boxRef} />
      {children}
    </div>
  );
};
