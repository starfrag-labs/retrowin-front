import { createFileRoute } from '@tanstack/react-router';
import { useTokenStore } from '../../../store/tokenStore';
import { readFolderQueryOption } from '../../../utils/queryOptions';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import z from 'zod';
import { FolderReader } from '../../../components/FolderReader';
import { createFolder } from '../../../utils/api/cloud';

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

  return (
    <div>
      <div>
        <button onClick={create}>create folder</button>
      </div>
      <FolderReader data={readFolderQuery.data} folderKey={params.folderKey} />
    </div>
  );
}
