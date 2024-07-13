import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { readFolderQueryOption } from '../utils/queryOptions/folder.query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Elements } from '../components/Elements';
import { useElementStore } from '../store/element.store';
import { Background } from '../components/Background';
// import { Window } from '../components/Window';
import { createRootFolder, getRootFolderKey } from '../api/cloud';
import { backgroundSelectorContainer } from '../styles/background.css';
import { IElementState } from '../types/store';
import { OptionMenu } from '../components/OptionMenu';
import { Selector } from '../components/Selector';
import { useRefStore } from '../store/ref.store';
import { Dragger } from '../components/Dragger';
import { Loading } from '../components/Loading';
import { useWindowStore } from '../store/window.store';
import { WindowV2 } from '../components/Window';
import { Progress } from '../components/Progress';

export const Route = createFileRoute('/main')({
  beforeLoad: async () => {
    const rootFolderKey = await getRootFolderKey()
      .then((response) => {
        return response.data;
      })
      .catch(async (error) => {
        if (error.response.status === 404) {
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
    queryClient.ensureQueryData(readFolderQueryOption(rootFolderKey));
  },
  pendingComponent: () => <Loading />,
  component: MainComponent,
});

function MainComponent() {
  const { rootFolderKey } = Route.useRouteContext();
  const window = useWindowStore((state) => state.windows);
  const setElements = useElementStore((state) => state.addElements);
  const setBackgroundWindowRef = useRefStore(
    (state) => state.setBackgroundWindowRef
  );
  const rootFolderQuery = useSuspenseQuery(
    readFolderQueryOption(rootFolderKey)
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
            {window.map((window) => {
              return <WindowV2 key={window.key} windowKey={window.key} />;
            })}
            <Progress />
          </OptionMenu>
        </Background>
      </Dragger>
    </Selector>
  );
}
