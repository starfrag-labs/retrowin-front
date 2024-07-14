import { createFileRoute } from '@tanstack/react-router';
import { Loading } from '../../../components/Loading';
import { createRootFolder, getRootFolderKey } from '../../../api/cloud';
import { AxiosError } from 'axios';
import { readFolderQueryOption } from '../../../utils/queryOptions/folder.query';
import { Elements } from '../../../components/mobile/mElements';

export const Route = createFileRoute('/_mLayout/m/')({
  beforeLoad: async () => {
    const rootFolderKey = await getRootFolderKey()
      .then((response) => {
        return response.data;
      })
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
  loader: async ({ context: { queryClient, rootFolderKey } }) => {
    const queryResult = queryClient.ensureQueryData(readFolderQueryOption(rootFolderKey));
    return queryResult;
  },
  pendingComponent: () => <Loading />,
  component: Component,
});

function Component() {
  const queryResult = Route.useLoaderData();
  console.log(queryResult);
  
  return (
    <Elements data={queryResult} />
  )
}
