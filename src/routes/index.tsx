import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useRef, useEffect } from 'react';
import { Background } from '../components/Background';
import { Dragger } from '../components/Dragger';
import { Elements } from '../components/Elements';
import { OptionMenu } from '../components/OptionMenu';
import { Progress } from '../components/Progress';
import { Selector } from '../components/Selector';
import { WindowV2 } from '../components/Window';
import { useWindowStore } from '../store/window.store';
import { backgroundSelectorContainer } from '../styles/background.css';
import { readFolderQueryOption } from '../utils/queryOptions/folder.query';
import { createRootFolder, getRootFolderKey } from '../api/cloud';
import { AxiosError } from 'axios';
import MobileDetect from 'mobile-detect';
import { KeyboardEventHandler } from '../components/KeyboardEventHandler';
import { CircularLoading } from '../components/CircularLoading';

const codeSchema = z.object({
  mobile: z.boolean().optional().default(false),
});

export const Route = createFileRoute('/')({
  validateSearch: codeSchema,
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
    await queryClient.prefetchQuery(readFolderQueryOption(rootFolderKey));
  },
  pendingComponent: () => <CircularLoading />,
  component: IndexComponent,
});

function IndexComponent() {
  const { rootFolderKey } = Route.useRouteContext();
  const { mobile } = Route.useSearch();

  const window = useWindowStore((state) => state.windows);

  const setBackgroundWindowRef = useWindowStore(
    (state) => state.setBackgroundWindowRef
  );

  const backgroundWindowRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate({ from: '/' });

  useEffect(() => {
    const md = new MobileDetect(navigator.userAgent);
    if (!mobile && md.isPhoneSized()) {
      navigate({ to: '/m' });
    }
  }, [mobile, navigate]);

  useEffect(() => {
    if (backgroundWindowRef.current) {
      setBackgroundWindowRef(backgroundWindowRef);
    }
  }, [backgroundWindowRef, setBackgroundWindowRef]);

  return (
    <Selector>
      <KeyboardEventHandler />
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
