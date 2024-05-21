import { StoreElement } from '../store/elementStore';
import { Element } from './Element';

function EmptyFolder() {
  return <div>Empty Folder</div>;
}

// function Element({
//   targetKey,
//   initialName,
//   rename,
// }: {
//   targetKey: string;
//   initialName: string;
//   rename: (key: string, newName: string) => void;
// }) {
//   const [name, setName] = useState(initialName);
//   const [isModifying, setIsModifying] = useState(false);

//   const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const newName = new FormData(event.currentTarget).get('newName') as string;
//     setName(newName);
//     rename(targetKey, newName);
//     setIsModifying(false);
//   };

//   return (
//     <div>
//       <form onSubmit={submitHandler}>
//         {isModifying ? (
//           <input name="newName" defaultValue={name} />
//         ) : (
//           <div onClick={() => setIsModifying(!isModifying)}>{name}</div>
//         )}
//       </form>
//     </div>
//   );
// }

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
