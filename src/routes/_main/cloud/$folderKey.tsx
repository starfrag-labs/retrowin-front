import { createFileRoute } from '@tanstack/react-router'
import { useTokenStore } from '../../../store/tokenStore';
import { readFolderQuery } from '../../../utils/queryOptions';

export const Route = createFileRoute('/_main/cloud/$folderKey')({
  loader: async ({ params, context: {queryClient} }) => {
    const accessToken = useTokenStore.getState().accessToken;
    queryClient.ensureQueryData(readFolderQuery(accessToken, params.folderKey));
  },
  component: CloudComponent,
});

function CloudComponent() {

  return (
    <div>
      <h1>Cloud</h1>
    </div>
  );
}