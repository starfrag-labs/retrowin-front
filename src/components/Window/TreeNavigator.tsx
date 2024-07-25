import { useQuery } from "@tanstack/react-query";
import React from "react"
import { readFolderQueryOption } from "../../utils/queryOptions/folder.query";

export const TreeNavigator = ({
  folderKey,
}: {
  folderKey: string;
}): React.ReactElement => {
  const readTargetFolderQuery = useQuery(readFolderQueryOption(folderKey));
  const { data } = readTargetFolderQuery;

  const [opened, setOpened] = React.useState<string[]>([]);

  const handleOpen = (key: string) => {
    if (opened.includes(key)) {
      setOpened(opened.filter((k) => k !== key));
    } else {
      setOpened([...opened, key]);
    }
  };

  if (readTargetFolderQuery.isFetching) return <p>Loading...</p>;

  if (readTargetFolderQuery.isError) return <p>Error</p>;

  if (!data) return <p>No data</p>;

  return (
    <div>
      {data.folders.map((folder) => (
        <div
          key={folder.key}
          className={opened.includes(folder.key) ? 'opened' : 'closed'}
          onClick={() => handleOpen(folder.key)}
        >
          <p>{folder.name}</p>
          {opened.includes(folder.key) && <TreeNavigator folderKey={folder.key} />}
        </div>
      ))}
    </div>
  );
};