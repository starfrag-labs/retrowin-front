import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { StoreElement, useElementStore } from '../store/elementStore';
import { useTokenStore } from '../store/tokenStore';
import { renameFolder } from '../utils/api/cloud';

export const Element = ({ element }: { element: StoreElement }) => {
  const accessToken = useTokenStore.getState().accessToken;
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(element.name);
  const elementStore = useElementStore();

  const rename = async (newName: string) => {
    const tempName = element.name;
    setName(newName);
    setIsEditing(false);
    if (element.type === 'folder') {
      await renameFolder(accessToken, element.key, newName)
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ['read', 'folder', element.key],
          });
          elementStore.renameElement(element.key, newName);
        })
        .catch(() => {
          elementStore.renameElement(element.key, tempName);
          setName(tempName);
        });
    }
  };

  const deleteElement = async () => {
    elementStore.removeElement(element.key);
    queryClient.invalidateQueries({
      queryKey: ['read', 'folder', element.key],
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    rename(new FormData(event.currentTarget).get('newName') as string);
  }

  return (
    <div>
      <div>
        {element.type === 'folder' ? (
          <button onClick={deleteElement}>delete folder</button>
        ) : (
          <button onClick={deleteElement}>delete file</button>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
      >
        {isEditing ? (
          <input name="newName" defaultValue={name} />
        ) : (
          <div onClick={() => setIsEditing(!isEditing)}>{name}</div>
        )}
      </form>
    </div>
  );
};
