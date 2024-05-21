import { createFileRoute } from '@tanstack/react-router';
import { useTokenStore } from '../../../store/tokenStore';
import { readFolderQueryOption } from '../../../utils/queryOptions';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import z from 'zod';
import { FolderReader } from '../../../components/FolderReader';
import { createFolder } from '../../../utils/api/cloud';
import { useEffect, useState } from 'react';
import { StoreElement, useElementStore } from '../../../store/elementStore';

export const Route = createFileRoute('/_main/cloud/$folderKey')({
  parseParams: (params) => {
    return { folderKey: z.string().uuid().parse(params.folderKey) };
  },
  loader: async ({ params, context: { queryClient } }) => {
    const accessToken = useTokenStore.getState().accessToken;
    queryClient.ensureQueryData(
      readFolderQueryOption(accessToken, params.folderKey)
    );
  },
  pendingComponent: () => <div>Loading...</div>,
  component: CloudComponent,
});

function CloudComponent() {
  const [elements, setElements] = useState<StoreElement[]>([]);
  const elementStore = useElementStore();
  const queryClient = useQueryClient();
  const accessToken = useTokenStore.getState().accessToken;
  const params = Route.useParams();
  const readFolderQuery = useSuspenseQuery(
    readFolderQueryOption(accessToken, params.folderKey)
  );

  const create = async () => {
    await createFolder(accessToken, params.folderKey, 'new-folder');
    queryClient.invalidateQueries(
      readFolderQueryOption(accessToken, params.folderKey)
    );
  };

  useEffect(() => {
    const data = readFolderQuery.data;
    if (!data) {
      return;
    }
    const folderElements: StoreElement[] = data.folders.map((folder) => {
      return {
        key: folder.key,
        name: folder.name,
        type: 'folder',
        parentKey: params.folderKey,
      };
    });
    const fileElements: StoreElement[] = data.files.map((file) => {
      return {
        key: file.key,
        name: file.name,
        type: 'file',
        parentKey: params.folderKey,
      };
    });
    setElements([...folderElements, ...fileElements]);
  }, [params.folderKey, readFolderQuery.data]);

  useEffect(() => {
    elementStore.setElements(elements);
  }, [elementStore, elements]);

  return (
    <div>
      <div>
        <button onClick={create}>create folder</button>
      </div>
      <FolderReader elements={elements} />
    </div>
  );
}
