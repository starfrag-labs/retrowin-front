import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { useTokenStore } from '../store/token.store';
import { useUserStore } from '../store/user.store';
import { cloudBackground } from '../css/styles/background.css';
import { createRootFolder, getRootFolderKey } from '../utils/api/cloud';
import { readFolderQueryOption } from '../utils/queryOptions/folder.query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Elements } from '../components/Elements';
import { IStoreElement } from '../types/element';
import { Selector } from '../components/Selector';
import { useElementStore } from '../store/element.store';

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
  const { accessToken, rootFolderKey } = Route.useRouteContext();
  const setElements = useElementStore((state) => state.setElements);
  const rootFolderQuery = useSuspenseQuery(
    readFolderQueryOption(accessToken, rootFolderKey)
  );
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = rootFolderQuery.data;
    if (!data) {
      return;
    }
    const rootFolderElement: IStoreElement = {
      elementKey: rootFolderKey,
      name: '/',
      type: 'folder',
      parentKey: '',
      selected: false,
    };
    const folderElements: IStoreElement[] = data.folders.map((folder) => {
      return {
        elementKey: folder.key,
        name: folder.name,
        type: 'folder',
        parentKey: rootFolderKey,
        selected: false,
      };
    });
    const fileElements: IStoreElement[] = data.files.map((file) => {
      return {
        elementKey: file.key,
        name: file.name,
        type: 'file',
        parentKey: rootFolderKey,
        selected: false,
      };
    });
    setElements([rootFolderElement, ...folderElements, ...fileElements]);
  }, [rootFolderKey, rootFolderQuery.data, setElements]);

  return (
    <div className={cloudBackground} id="background" ref={backgroundRef}>
      <Selector parentRef={backgroundRef}>
        <Elements folderKey={rootFolderKey} />
      </Selector>
    </div>
  );
}
