import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getFavoriteFoldersQueryOption } from '../../utils/queryOptions/user.query';
import {
  favoriteItem,
  favoriteSidebar,
  favoriteTitle,
} from '../../styles/windows/sidebar.css';
import { useWindowStore } from '../../store/window.store';

export const FavoriteSidebar = ({
  windowKey,
}: {
  windowKey: string;
}): React.ReactElement => {
  const readFavoriteFoldersQuery = useQuery(getFavoriteFoldersQueryOption());

  const updateWindow = useWindowStore((state) => state.updateWindow);

  const handleClick = (targetKey: string) => {
    updateWindow(windowKey, targetKey);
  };

  if (readFavoriteFoldersQuery.isFetching) return <p>Loading...</p>;

  if (readFavoriteFoldersQuery.isError) return <p>Error</p>;

  if (!readFavoriteFoldersQuery.data) return <p>No data</p>;

  return (
    <div className={favoriteSidebar}>
      <div className={favoriteTitle}>pinned folders</div>
      {readFavoriteFoldersQuery.data.map((folder) => (
        <div
          key={folder.key}
          className={favoriteItem}
          onClick={() => handleClick(folder.key)}
        >
          {folder.name}
        </div>
      ))}
    </div>
  );
};
