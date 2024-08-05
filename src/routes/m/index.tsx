import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { CircularLoading } from '../../components/pc/CircularLoading';
import { getRootFolderKeyQueryOption } from '../../utils/queryOptions/folder.query';

export const Route = createFileRoute('/m/')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const rootFolderKey = await queryClient.ensureQueryData(
      getRootFolderKeyQueryOption(true)
    );

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
