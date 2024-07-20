import { useMobileElementStore } from '../../store/mobile/element.store';
import { elementsContainer } from '../../styles/mobile/element.css';
import { Element } from './Element';

export const Elements = ({
  folderKey,
  selecting,
}: {
  folderKey: string;
  selecting: boolean;
}) => {
  const elements = useMobileElementStore((state) =>
    state.findElementsByParentKey(folderKey)
  );
  return (
    <div className={elementsContainer}>
      {elements.map((element) => (
        <Element
          key={element.key}
          elementKey={element.key}
          name={element.name}
          type={element.type}
          parentKey={element.parentKey}
          selected={element.selected}
          selecting={selecting}
        />
      ))}
    </div>
  );
};
