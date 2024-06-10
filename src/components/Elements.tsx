import { useEffect, useRef, useState } from 'react';
import { elementsContainer } from '../css/styles/element.css';
import { IStoreElement } from '../types/element';
import { Element } from './Element';
import { useRefStore } from '../store/ref.store';
import { useElementStore } from '../store/element.store';
import { Uploader } from './Uploader';

export const Elements = ({
  folderKey,
}: {
  folderKey: string;
}): React.ReactElement => {
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

  const uploadFileElement: IStoreElement = {
    elementKey: 'upload-file',
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
        <Element {...uploadFileElement} selected={false} />
      </div>
      {elements.map((element) => (
        <div
          key={element.elementKey}
          ref={(el) => {
            if (el) {
              elementsRef.current.set(element.elementKey, el);
            }
          }}
        >
          <Element {...element} />
        </div>
      ))}
    </div>
  );
};
