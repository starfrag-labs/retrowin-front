import { createFileRoute } from '@tanstack/react-router';
import { useTokenStore } from '../../../store/tokenStore';
import { readFolderQueryOption } from '../../../utils/queryOptions';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import z from 'zod';
import { FolderReader } from '../../../components/FolderReader';
import { createFolder } from '../../../utils/api/cloud';
import { useEffect, useState } from 'react';
import { StoreElement, useElementStore } from '../../../store/elementStore';
import { UploadForm } from '../../../components/UploadForm';
import { VideoPlayer } from '../../../components/VideoPlayer';

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
  const setElementsStore = useElementStore().setElements;
  const queryClient = useQueryClient();
  const accessToken = useTokenStore.getState().accessToken;
  const params = Route.useParams();
  const readFolderQuery = useSuspenseQuery(
    readFolderQueryOption(accessToken, params.folderKey)
  );

  const [showUploadForm, setShowUploadForm] = useState(false);

  const createFolderHandler = async () => {
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
    setElementsStore([...folderElements, ...fileElements]);
  }, [params.folderKey, readFolderQuery.data, setElementsStore]);

  return (
    <div>
      <button onClick={createFolderHandler}>create folder</button>
      <button onClick={() => setShowUploadForm(!showUploadForm)}>
        upload File
      </button>
      <VideoPlayer
        folderKey="42a5dac4-8409-43a7-8456-271c463883d1"
        fileKey="604f22d2-5c0a-4498-9a8f-0fee9e8fc201"
      />
      <FolderReader elements={elements} />
      {showUploadForm && <UploadForm folderKey={params.folderKey} />}
    </div>
  );
}
