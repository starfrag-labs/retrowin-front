import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { createRootFolder } from '../../api/cloud';
import { CircularLoading } from '../../components/CircularLoading';
import { getRootFolderKeyQueryOption } from '../../utils/queryOptions/folder.query';

export const Route = createFileRoute('/m/')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const rootFolderKey = await queryClient
      .ensureQueryData(getRootFolderKeyQueryOption())
      .catch(async (error: AxiosError) => {
        if (error.response?.status === 404) {
          const result = await createRootFolder();
          return result.data;
        }
        throw error;
      });

    return {
      rootFolderKey: rootFolderKey,
    };
  },
  pendingComponent: () => <CircularLoading />,
  component: Component,
});

function Component() {
  const { rootFolderKey } = Route.useRouteContext();
  const navigate = useNavigate({ from: '/m' });
  useEffect(() => {
    navigate({ to: '/m/$folderKey', params: { folderKey: rootFolderKey } });
  }, [navigate, rootFolderKey]);

  return null;
}
