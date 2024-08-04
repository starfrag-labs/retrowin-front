import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useRef, useEffect } from 'react';
import { Background } from '../components/pc/Background';
import { Dragger } from '../components/pc/Dragger';
import { Elements } from '../components/pc/Elements';
import { OptionMenu } from '../components/pc/OptionMenu';
import { Progress } from '../components/pc/Progress';
import { Selector } from '../components/pc/Selector';
import { WindowV2 } from '../components/pc/Window';
import { useWindowStore } from '../store/window.store';
import MobileDetect from 'mobile-detect';
import { CircularLoading } from '../components/pc/CircularLoading';
import { pcPageContainer } from '../styles/common/page.css';
import { backgroundSelectorContainer, moonThemeIcon, sunThemeIcon } from '../styles/pc/background.css';
import { KeyboardEventHandler } from '../components/pc/KeyboardEventHandler';
import { getRootFolderKeyQueryOption, readFolderQueryOption } from '../utils/queryOptions/folder.query';
import { useThemeStore } from '../store/theme.store';
import { FaSun } from 'react-icons/fa';
import { FaMoon } from 'react-icons/fa';

const codeSchema = z.object({
  mobile: z.boolean().optional().default(false),
});

export const Route = createFileRoute('/')({
  validateSearch: codeSchema,
  beforeLoad: async ({ context: { queryClient } }) => {
    const rootFolderKey = await queryClient.ensureQueryData(
      getRootFolderKeyQueryOption(true)
    );

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

  // Store
  const window = useWindowStore((state) => state.windows);
  const themeKey = useThemeStore((state) => state.getCurrentThemeKey());
  
  // Actions
  const setTheme = useThemeStore((state) => state.setTheme);
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
    <div className={pcPageContainer}>
      <Selector>
        <KeyboardEventHandler />
        <Dragger>
          <Background />
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
        </Dragger>
      </Selector>
      {themeKey === 'light' && ( 
        <FaSun
          className={sunThemeIcon}
          onClick={() => {
            setTheme('dark');
          }}
        />
      )}
      {themeKey === 'dark' && (
        <FaMoon
        className={moonThemeIcon}
          onClick={() => {
            setTheme('light');
          }}
        />
      )}
    </div>
  );
}
