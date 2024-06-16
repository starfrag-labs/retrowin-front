import { useEffect, useRef, useState } from 'react';
import { Element } from './Element';
import { useRefStore } from '../store/ref.store';
import { useElementStore } from '../store/element.store';
import { Uploader } from './Uploader';
import { elementsContainer } from '../styles/element.css';
import { IElementState } from '../types/store';

export const Elements = ({ folderKey }: { folderKey: string }): React.ReactElement => {
  const elements = useElementStore((state) =>
    state.getElementsByParentKey(folderKey)
  );
  const [uploading, setUploading] = useState(false);
  const elementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const setElementsRef = useRefStore((state) => state.setElementsRef);

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
  };

  return (
    <div className={elementsContainer}>
      {uploading && (
        <Uploader folderKey={folderKey} setUploading={setUploading} />
      )}
      <div onDoubleClick={() => setUploading(!uploading)}>
        <Element
          elementKey={uploadFileElement.key}
          name={uploadFileElement.name}
          parentKey={uploadFileElement.parentKey}
          type={uploadFileElement.type}
          selected={false}
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
          />
        </div>
      ))}
    </div>
  );
};
