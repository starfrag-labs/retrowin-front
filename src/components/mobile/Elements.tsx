import { useMobileElementStore } from '../../store/mobile/element.store';
import { elementsContainer, emptyFolderMessage } from '../../styles/mobile/element.css';
import { Element } from './Element';

export const Elements = ({
  folderKey,
  selecting,
}: {
  folderKey: string;
  selecting: boolean;
}): React.ReactElement => {
  const elements = useMobileElementStore((state) =>
    state.findElementsByParentKey(folderKey)
  );

  if (elements.length === 0) {
    return <div className={elementsContainer}>
      <div className={emptyFolderMessage}>
        Empty folder
      </div>
    </div>;
  }

  return (
    <div className={elementsContainer}>
      {elements.map((element) => (
        <Element
          key={element.key}
          elementKey={element.key}
          name={element.name}
          type={element.type}
          selected={element.selected}
          selecting={selecting}
        />
      ))}
    </div>
  );
};
