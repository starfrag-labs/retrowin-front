import { useEffect, useRef } from 'react';
import { Element } from './Element';
import { useRefStore } from '../store/ref.store';
import { useElementStore } from '../store/element.store';
import { elementsContainer } from '../styles/element.css';
import { IElementState } from '../types/store';
import { useWindowStore } from '../store/window.store';

export const Elements = ({
  folderKey,
}: {
  folderKey: string;
}): React.ReactElement => {
  const elements = useElementStore((state) =>
    state.getElementsByParentKey(folderKey)
  );
  const elementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const setElementsRef = useRefStore((state) => state.setElementsRef);
  const newWindow = useWindowStore((state) => state.newWindow);

  useEffect(() => {
    if (elementsRef.current) {
      setElementsRef(elementsRef);
    }
  }, [setElementsRef]);

  const uploadFileElement: IElementState = {
    key: 'upload-file',
    name: 'upload',
    type: 'upload',
    parentKey: folderKey,
    selected: false,
    renaming: false,
  };

  const handleDoubleClick = () => {
    newWindow(folderKey, 'uploader');
  };

  return (
    <div className={elementsContainer}>
      <div onDoubleClick={handleDoubleClick}>
        <Element
          elementKey={uploadFileElement.key}
          name={uploadFileElement.name}
          parentKey={uploadFileElement.parentKey}
          type={uploadFileElement.type}
          selected={uploadFileElement.selected}
          renaming={uploadFileElement.renaming}
        />
      </div>
      {elements.map((element) => (
        <div
          key={element.key}
          ref={(el) => {
            if (el) {
              elementsRef.current.set(element.key, el);
            }
          }}
        >
          <Element
            elementKey={element.key}
            name={element.name}
            parentKey={element.parentKey}
            type={element.type}
            selected={element.selected}
            renaming={element.renaming}
          />
        </div>
      ))}
    </div>
  );
};
