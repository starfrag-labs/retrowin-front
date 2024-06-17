import { useCallback, useEffect, useRef, useState } from 'react';
import { selectBox, selector } from '../styles/selector.css';
import { useRefStore } from '../store/ref.store';
import { useElementStore } from '../store/element.store';
import { IElementState } from '../types/store';

export const AdvancedSelector = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const selectorRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [targetWindowRect, setTargetWindowRect] = useState<DOMRect>(
    document.body.getBoundingClientRect()
  );
  const [currentWindowElements, setCurrentWindowElements] = useState<
    IElementState[] | undefined
  >();
  const [shiftKey, setShiftKey] = useState(false);

  const selectElement = useElementStore((state) => state.selectElement);
  const unselectElement = useElementStore((state) => state.unselectElement);
  const unselectAllElements = useElementStore(
    (state) => state.unselectAllElements
  );
  const findElementByParentKey = useElementStore(
    (state) => state.findElementsByParentKey
  );

  const windowsRef = useRefStore((state) => state.windowsRef);
  const backgroundWindowRef = useRefStore((state) => state.backgroundWindowRef);
  const elementsRef = useRefStore((state) => state.elementsRef);
  const rootKey = useElementStore((state) => state.rootKey);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftKey(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftKey(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startSelecting = useCallback(
    (e: MouseEvent) => {
      if (
        !selectorRef.current ||
        !boxRef.current ||
        !backgroundWindowRef?.current ||
        !elementsRef
      )
        return;

      // Check if the target is not an element
      let isNotElement = true;
      elementsRef.forEach((elementRef, key) => {
        if (elementRef.current?.contains(e.target as Node)) {
          isNotElement = false;
          selectElement(key);
        }
      });
      if (!isNotElement) return;

      // Unselect all elements and set start position
      if (!shiftKey) unselectAllElements();
      setStartX(e.clientX);
      setStartY(e.clientY);

      if (backgroundWindowRef.current.contains(e.target as Node)) {
        setTargetWindowRect(
          backgroundWindowRef.current.getBoundingClientRect()
        );
        setCurrentWindowElements(findElementByParentKey(rootKey));
      }
      if (windowsRef) {
        windowsRef.forEach((window, parentKey) => {
          if (window.current && window.current.contains(e.target as Node)) {
            // Set target window rect
            setTargetWindowRect(window.current.getBoundingClientRect());
            // Set current window elements
            setCurrentWindowElements(findElementByParentKey(parentKey));
          }
        });
      }
    },
    [
      shiftKey,
      rootKey,
      elementsRef,
      backgroundWindowRef,
      windowsRef,
      selectElement,
      unselectAllElements,
      findElementByParentKey,
    ]
  );

  useEffect(() => {
    if (currentWindowElements) {
      setIsSelecting(true);
    }
  }, [currentWindowElements]);

  const checkElementsInBox = useCallback(() => {
    if (!elementsRef || !boxRef.current || !currentWindowElements) return;
    const boxRect = boxRef.current.getBoundingClientRect();
    currentWindowElements.forEach((element) => {
      const elementRef = elementsRef.get(element.key);
      if (!elementRef?.current) return;
      const elementRect = elementRef.current.getBoundingClientRect();
      if (
        boxRect.left < elementRect.right &&
        boxRect.right > elementRect.left &&
        boxRect.top < elementRect.bottom &&
        boxRect.bottom > elementRect.top
      ) {
        selectElement(element.key);
      } else if (!shiftKey && element.selected) {
        unselectElement(element.key);
      }
    });
  }, [currentWindowElements, elementsRef, selectElement, shiftKey, unselectElement]);

  const selecting = useCallback(
    (e: MouseEvent) => {
      if (!selectorRef.current || !boxRef.current || !isSelecting) return;
      const left = Math.max(
        Math.min(startX, e.clientX),
        targetWindowRect.left + 1
      );
      const top = Math.max(
        Math.min(startY, e.clientY),
        targetWindowRect.top + 1
      );
      const right = Math.min(
        Math.max(startX, e.clientX),
        targetWindowRect.right - 3
      );
      const bottom = Math.min(
        Math.max(startY, e.clientY),
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
    },
    [
      isSelecting,
      startX,
      targetWindowRect.left,
      targetWindowRect.top,
      targetWindowRect.right,
      targetWindowRect.bottom,
      startY,
      checkElementsInBox,
    ]
  );

  const stopSelecting = useCallback(() => {
    if (!boxRef.current) return;
    setIsSelecting(false);
    boxRef.current.style.display = 'none';
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', startSelecting);
    return () => {
      document.removeEventListener('mousedown', startSelecting);
    };
  }, [startSelecting]);

  useEffect(() => {
    document.addEventListener('mousemove', selecting);
    return () => {
      document.removeEventListener('mousemove', selecting);
    };
  }, [selecting]);

  useEffect(() => {
    document.addEventListener('mouseup', stopSelecting);
    return () => {
      document.removeEventListener('mouseup', stopSelecting);
    };
  }, [stopSelecting]);

  return (
    <div className={selector} ref={selectorRef}>
      <div className={selectBox} ref={boxRef} />
      {children}
    </div>
  );
};
