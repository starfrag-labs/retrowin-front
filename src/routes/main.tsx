import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { useTokenStore } from '../store/token.store';
import { readFolderQueryOption } from '../utils/queryOptions/folder.query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Elements } from '../components/Elements';
import { useElementStore } from '../store/element.store';
import { Background } from '../components/Background';
import { Window } from '../components/Window';
import { createRootFolder, getRootFolderKey } from '../api/cloud';
import { useWindowStore } from '../store/window.store';
import { AuthManager } from '../components/AuthManager';
import { backgroundSelectorContainer } from '../styles/background.css';
import { IElementState } from '../types/store';
import { OptionMenu } from '../components/OptionMenu';
import { Selector } from '../components/Selector';
import { useRefStore } from '../store/ref.store';
import { Dragger } from '../components/Dragger';
import { Loading } from '../components/Loading';

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
  pendingComponent: () => <Loading />,
  component: MainComponent,
});

function MainComponent() {
  const { accessToken, rootFolderKey } = Route.useRouteContext();
  const windows = useWindowStore((state) => state.windows);
  const setElements = useElementStore((state) => state.addElements);
  const setBackgroundWindowRef = useRefStore(
    (state) => state.setBackgroundWindowRef
  );
  const rootFolderQuery = useSuspenseQuery(
    readFolderQueryOption(accessToken, rootFolderKey)
  );
  const backgroundWindowRef = useRef<HTMLDivElement>(null);
  const setRootKey = useElementStore((state) => state.setRootKey);

  useEffect(() => {
    setRootKey(rootFolderKey);
  }, [rootFolderKey, setRootKey]);

  useEffect(() => {
    if (backgroundWindowRef.current) {
      setBackgroundWindowRef(backgroundWindowRef);
    }
  }, [backgroundWindowRef, setBackgroundWindowRef]);
  useEffect(() => {
    const data = rootFolderQuery.data;
    if (!data) {
      return;
    }
    const rootFolderElement: IElementState = {
      key: rootFolderKey,
      name: '/',
      type: 'folder',
      parentKey: '',
      selected: false,
      renaming: false,
    };
    const folderElements: IElementState[] = data.folders.map((folder) => {
      return {
        key: folder.key,
        name: folder.name,
        type: 'folder',
        parentKey: rootFolderKey,
        selected: false,
        renaming: false,
      };
    });
    const fileElements: IElementState[] = data.files.map((file) => {
      return {
        key: file.key,
        name: file.name,
        type: 'file',
        parentKey: rootFolderKey,
        selected: false,
        renaming: false,
      };
    });
    setElements([rootFolderElement, ...folderElements, ...fileElements]);
  }, [rootFolderKey, rootFolderQuery.data, setElements]);

  return (
    <AuthManager>
      <Selector>
        <Dragger>
          <Background>
            <OptionMenu>
              <div
                className={backgroundSelectorContainer}
                ref={backgroundWindowRef}
              >
                <Elements folderKey={rootFolderKey} />
              </div>
              {windows.map((window) => {
                return <Window key={window.key} windowKey={window.key} />;
              })}
            </OptionMenu>
          </Background>
        </Dragger>
      </Selector>
    </AuthManager>
  );
}
