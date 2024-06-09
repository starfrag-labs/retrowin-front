import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTokenStore } from '../store/tokenStore';
import { useUserStore } from '../store/userStore';
import { cloudBackground } from '../css/styles/background.css';
import { createRootFolder, getRootFolderKey } from '../utils/api/cloud';
import { readFolderQueryOption } from '../utils/queryOptions/folder.query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Elements } from '../components/Elements';
import { IElement } from '../types/element';
import { Selector } from '../components/Selector';
import { useElementStore } from '../store/elementStore';

export const Route = createFileRoute('/cloud')({
  beforeLoad: async () => {
    const accessToken = useTokenStore.getState().accessToken;
    const { profile, isCloudUser } = useUserStore.getState();
    if (!accessToken || !isCloudUser || !profile) {
      throw redirect({
        to: '/',
      });
    }
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
    return {
      accessToken: accessToken,
      rootFolderKey: rootFolderKey,
    };
  },
  loader: async ({ context: { queryClient, rootFolderKey, accessToken } }) => {
    queryClient.ensureQueryData(
      readFolderQueryOption(accessToken, rootFolderKey)
    );
  },
  pendingComponent: () => <div>Loading...</div>,
  component: MainComponent,
});

function MainComponent() {
  const elements = useElementStore((state) =>
    Array.from(state.elements.values())
  );
  const setElements = useElementStore((state) => state.setElements);
  const { accessToken, rootFolderKey } = Route.useRouteContext();
  const rootFolderQuery = useSuspenseQuery(
    readFolderQueryOption(accessToken, rootFolderKey)
  );

  useEffect(() => {
    const data = rootFolderQuery.data;
    if (!data) {
      return;
    }
    const folderElements: IElement[] = data.folders.map((folder) => {
      return {
        key: folder.key,
        name: folder.name,
        type: 'folder',
        parentKey: rootFolderKey,
        selected: false,
      };
    });
    const fileElements: IElement[] = data.files.map((file) => {
      return {
        key: file.key,
        name: file.name,
        type: 'file',
        parentKey: rootFolderKey,
        selected: false,
      };
    });
    setElements([...folderElements, ...fileElements]);
  }, [rootFolderKey, rootFolderQuery.data, setElements]);

  return (
    <div className={cloudBackground} id="background">
      <Selector>
        <Elements elements={elements} folderKey={rootFolderKey} />
      </Selector>
    </div>
  );
}
