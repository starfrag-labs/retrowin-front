import { useRef, useState } from 'react';
import { draggingElementsIcon } from '../../../styles/element.css';
import { selectBox } from '../../../styles/selector.css';
import { CustomMouseEventType } from '../../../types/event';

export const MouseEventManager = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  // Target window rect for the selector
  const [targetWindowRect, setTargetWindowRect] = useState<DOMRect>(
    document.body.getBoundingClientRect()
  );

  // Dragging elements state
  const [showDraggingElements, setShowDraggingElements] = useState(false);

  const selectBoxRef = useRef<HTMLDivElement>(null);
  const draggingElementsIconRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className={selectBox} ref={selectBoxRef} />
      <div
        className={draggingElementsIcon}
        ref={draggingElementsIconRef}
        hidden={!showDraggingElements}
      />
      {children}
    </div>
  );
};
