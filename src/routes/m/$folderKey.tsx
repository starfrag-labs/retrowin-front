import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CircularLoading } from '../../components/pc/CircularLoading';
import { useCallback, useEffect, useState } from 'react';
import { getFolderInfoQueryOption } from '../../utils/queryOptions/folder.query';
import { Elements } from '../../components/mobile/Elements';
import { IoMdReturnLeft } from 'react-icons/io';
import { FaRegSun } from 'react-icons/fa';
import { FaRegMoon } from 'react-icons/fa';
import {
  navContainer,
  navItemsContainer,
  navLogoContainer,
  icon,
  smallIcon,
} from '../../styles/mobile/nav.css';
import { FaPlus } from 'react-icons/fa6';
import { Logo } from '../../components/Logo';
import { Uploader } from '../../components/mobile/Menu/CreateMenu';
import { EditMenu } from '../../components/mobile/Menu/EditMenu';
import { ProgressSpinner } from '../../components/mobile/ProgressSpinner';
import { useQuery } from '@tanstack/react-query';
import { useElementStore } from '../../store/element.store';
import {
  mobilePageContainer,
  mobilePageContent,
} from '../../styles/common/page.css';
import { useThemeStore } from '../../store/theme.store';

export const Route = createFileRoute('/m/$folderKey')({
  loader: async ({ params }) => {
    return {
      folderKey: params.folderKey,
    };
  },
  pendingComponent: () => <CircularLoading />,
  component: Component,
});

function Component() {
  // Params
  const folderKey = Route.useParams().folderKey;

  // States
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [selecting, setSelecting] = useState<boolean>(false);

  // Query
  const infoQuery = useQuery(getFolderInfoQueryOption(folderKey));

  // Store
  const selectedKeys = useElementStore((state) => state.selectedKeys);
  const themeKey = useThemeStore((state) => state.getCurrentThemeKey());
  const setTheme = useThemeStore((state) => state.setTheme);

  // Actions
  const unselectAll = useElementStore((state) => state.unselectAllKeys);

  // Navigation
  const navigate = useNavigate({ from: '/m/$folderKey' });

  // Functions
  const toggleOpenMenu = useCallback(() => {
    setOpenMenu(!openMenu);
  }, [openMenu, setOpenMenu]);

  useEffect(() => {
    setSelecting(selectedKeys.length > 0);
  }, [selectedKeys.length, setSelecting]);

  return (
    <div className={mobilePageContainer}>
      <nav className={navContainer}>
        {infoQuery.data?.parentKey ? (
          <div className={navItemsContainer}>
            <IoMdReturnLeft
              onClick={() => {
                navigate({
                  to: '/m/$folderKey',
                  params: { folderKey: infoQuery.data.parentKey },
                });
              }}
              className={icon}
            />
            <div>{infoQuery.data.name}</div>
          </div>
        ) : (
          <div className={navLogoContainer}>
            <Logo logoSize="2rem" fontSize="1.5rem" />
          </div>
        )}
        <div className={navItemsContainer}>
          <ProgressSpinner />
          {openMenu && themeKey === 'light' && (
            <FaRegMoon onTouchEnd={() => setTheme('dark')} className={smallIcon} />
          )}
          {openMenu && themeKey === 'dark' && (
            <FaRegSun onTouchEnd={() => setTheme('light')} className={smallIcon} />
          )}
          <FaPlus
            className={icon}
            onTouchEnd={selecting ? unselectAll : toggleOpenMenu}
            style={{
              transform:
                selecting || openMenu ? 'rotate(45deg)' : 'rotate(0deg)',
            }}
          />
        </div>
      </nav>
      <div className={mobilePageContent}>
        <Elements folderKey={folderKey} selecting={selecting} />
      </div>
      {openMenu && <Uploader folderKey={folderKey} toggle={toggleOpenMenu} />}
      {selecting && !openMenu && <EditMenu folderKey={folderKey} />}
    </div>
  );
}
