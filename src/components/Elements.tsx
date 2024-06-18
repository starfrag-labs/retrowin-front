import { Element } from './Element';
import { useElementStore } from '../store/element.store';
import { elementsContainer } from '../styles/element.css';
import { IElementState } from '../types/store';
import { useWindowStore } from '../store/window.store';

export const Elements = ({ folderKey, isWindowElements = false }: { folderKey: string, isWindowElements?: boolean }): React.ReactElement => {
  const elements = useElementStore((state) =>
    state.getElementsByParentKey(folderKey)
  );
  const newWindow = useWindowStore((state) => state.newWindow);

  const uploadFileElement: IElementState = {
    key: 'upload-file',
    name: 'upload',
    type: 'upload',
    parentKey: folderKey,
    selected: false,
    renaming: false,
  };

  const handleDoubleClick = () => {
    newWindow(`${folderKey}-upload`, 'uploader');
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
          isWindowElement={isWindowElements}
        />
      </div>
      {elements.map((element) => (
        <Element
          key={element.key}
          elementKey={element.key}
          name={element.name}
          parentKey={element.parentKey}
          type={element.type}
          selected={element.selected}
          renaming={element.renaming}
          isWindowElement={isWindowElements}
        />
      ))}
    </div>
  );
};
