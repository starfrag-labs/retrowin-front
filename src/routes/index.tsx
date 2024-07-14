import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { getProfile } from '../api/auth';
import config from '../utils/config';
import { useUserStore } from '../store/user.store';
import { Loading } from '../components/Loading';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';
import { Background } from '../components/Background';
import { Dragger } from '../components/Dragger';
import { Elements } from '../components/Elements';
import { OptionMenu } from '../components/OptionMenu';
import { Progress } from '../components/Progress';
import { Selector } from '../components/Selector';
import { WindowV2 } from '../components/Window';
import { useElementStore } from '../store/element.store';
import { useRefStore } from '../store/ref.store';
import { useWindowStore } from '../store/window.store';
import { backgroundSelectorContainer } from '../styles/background.css';
import { IElementState } from '../types/store';
import { readFolderQueryOption } from '../utils/queryOptions/folder.query';
import { checkUser, createRootFolder, enrollUser, getRootFolderKey } from '../api/cloud';
import { AxiosError } from 'axios';

const codeSchema = z.object({
  code: z.string().optional(),
});

export const Route = createFileRoute('/')({
  validateSearch: codeSchema,
  beforeLoad: async () => {
    const setProfile = useUserStore.getState().setProfile;
    await getProfile()
      .then((response) => {
        setProfile(response.data.data);
      })
      .catch(() => {
        window.location.href = `${config.auth}?redirect=${config.redirectUrl}`;
      });
    await checkUser().catch(async (error: AxiosError) => {
      if (error.response?.status === 404) {
        await enrollUser();
        return;
      }
      throw error;
    });

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
    queryClient.ensureQueryData(readFolderQueryOption(rootFolderKey));
  },
  pendingComponent: () => <Loading />,
  component: IndexComponent,
});

function IndexComponent() {
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

