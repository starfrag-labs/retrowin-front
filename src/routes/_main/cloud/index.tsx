import { createFileRoute, redirect } from '@tanstack/react-router';
import { useTokenStore } from '../../../store/tokenStore';
import { createRootFolder, getRootFolderKey } from '../../../utils/api/cloud';

export const Route = createFileRoute('/_main/cloud/')({
  beforeLoad: async () => {
    const accessToken = useTokenStore.getState().accessToken;
    const rootFolderKey = await getRootFolderKey(accessToken)
      .then((response) => {
        return response.data;
      })
      .catch(async (error) => {
        if (error.response.status === 404) {
          const result = await createRootFolder(accessToken);
          return result.data;
        }
        throw error;
      });
    if (!rootFolderKey) {
      throw redirect({
        to: '/',
      });
    }
    throw redirect({
      to: `/cloud/$folderKey`,
      params: {
        folderKey: rootFolderKey,
      },
    });
  },
  pendingComponent: () => null,
  component: () => null,
});
