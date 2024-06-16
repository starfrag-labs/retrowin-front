import { createFileRoute, redirect } from '@tanstack/react-router';
import { createRef, useEffect } from 'react';
import { useTokenStore } from '../store/token.store';
import { readFolderQueryOption } from '../utils/queryOptions/folder.query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Elements } from '../components/Elements';
import { IStoreElement } from '../types/element';
import { Selector } from '../components/Selector';
import { useElementStore } from '../store/element.store';
import { Background } from '../components/Background';
import { Window } from '../components/Window';
import { createRootFolder, getRootFolderKey } from '../api/cloud';
import { useWindowStore } from '../store/window.store';
import { AuthManager } from '../components/AuthManager';
import { backgroundSelectorContainer } from '../styles/background.css';

export const Route = createFileRoute('/main')({
  beforeLoad: async () => {
    const accessToken = useTokenStore.getState().accessToken;
    if (!accessToken) {
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
  const windowOrder = useWindowStore((state) => state.windowOrder);
  const setElements = useElementStore((state) => state.setElements);
  const rootFolderQuery = useSuspenseQuery(
    readFolderQueryOption(accessToken, rootFolderKey)
  );
  const backgroundSelectorRef = createRef<HTMLDivElement>();

  useEffect(() => {
    console.log(windowOrder);
  }, [windowOrder]);

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
    <AuthManager>
      <Background>
        <div
          className={backgroundSelectorContainer}
          ref={backgroundSelectorRef}
        >
          <Selector>
            <Elements folderKey={rootFolderKey} />
          </Selector>
        </div>
        {windowOrder.map((windowKey) => {
          return <Window key={windowKey} windowKey={windowKey} />;
        })}
      </Background>
    </AuthManager>
  );
}
