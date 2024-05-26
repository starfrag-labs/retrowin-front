import { StoreElement } from '../store/elementStore';
import { Element } from './Element';

function EmptyFolder() {
  return <div>Empty Folder</div>;
}

export function FolderReader({
  elements,
}: {
  elements: StoreElement[];
}) {
  return (
    <div>
      {elements.length === 0 ? (
        <EmptyFolder />
      ) : (
        <div>
          {elements.map((element) => (
            <Element key={element.key} element={element} />
          ))}
        </div>
      )}
    </div>
  );
}
