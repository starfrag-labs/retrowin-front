import { useEffect, useRef } from "react";
import { elementsContainer } from "../css/styles/element.css";
import { IStoreElement } from '../types/element';
import { Element } from './Element';
import { useRefStore } from "../store/ref.store";

export const Elements = ({
  elements,
  folderKey,
}: {
  elements: IStoreElement[];
  folderKey: string;
}): React.ReactElement => {
  const elementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const setElementsRef = useRefStore((state) => state.setElementsRef);

  const uploadFileHandler = () => {
    console.log('upload file');
  };

  const uploadFileElement: IStoreElement = {
    key: 'upload-file',
    name: 'upload',
    type: 'upload',
    parentKey: folderKey,
    selected: false,
  };

  useEffect(() => {
    if (elementsRef.current) {
      setElementsRef(elementsRef);
    }
  }, [setElementsRef]);

  return (
    <div className={elementsContainer}>
      <Element
        element={uploadFileElement}
        uploadFileHandler={uploadFileHandler}
      />
      {elements.map((element) => (
        <div
          key={element.key}
          ref={(el) => {
            if (el) {
              elementsRef.current.set(element.key, el);
            }
          }}
        >
          <Element element={element} />
        </div>
      ))}
    </div>
  );
};