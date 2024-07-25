import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CircularLoading } from '../../components/CircularLoading';
import { useCallback, useEffect, useState } from 'react';
import {
  backgroundContainer,
  background,
} from '../../styles/mobile/background.css';
import { getFolderInfoQueryOption } from '../../utils/queryOptions/folder.query';
import { Elements } from '../../components/mobile/Elements';
import { IoMdReturnLeft } from 'react-icons/io';
import {
  navContainer,
  navItemsContainer,
  returnIcon,
  uploadIcon,
} from '../../styles/mobile/nav.css';
import { FaPlus } from 'react-icons/fa6';
import { Logo } from '../../components/Logo';
import { Uploader } from '../../components/mobile/Menu/CreateMenu';
import { EditMenu } from '../../components/mobile/Menu/EditMenu';
import { ProgressSpinner } from '../../components/mobile/ProgressSpinner';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useElementStoreV3 } from '../../store/element.store.v3';

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
  const [uploading, setUploading] = useState<boolean>(false);
  const [selecting, setSelecting] = useState<boolean>(false);

  // Query
  const infoQuery = useSuspenseQuery(getFolderInfoQueryOption(folderKey));

  // Store
  const selectedKeys = useElementStoreV3((state) => state.selectedKeys);

  // Actions
  const unselectAll = useElementStoreV3((state) => state.unselectAllKeys);

  // Navigation
  const navigate = useNavigate({ from: '/m/$folderKey' });

  // Functions
  const toggleUploading = useCallback(() => {
    setUploading(!uploading);
  }, [uploading, setUploading]);

  useEffect(() => {
    setSelecting(selectedKeys.length > 0);
  }, [selectedKeys.length, setSelecting]);

  return (
    <div className={backgroundContainer}>
      <div className={background} />
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
              className={returnIcon}
            />
            <div>{infoQuery.data.name}</div>
          </div>
        ) : (
          <Logo />
        )}
        <div className={navItemsContainer}>
          <ProgressSpinner />
          <FaPlus
            className={uploadIcon}
            onTouchEnd={selecting ? unselectAll : toggleUploading}
            style={{
              transform: selecting ? 'rotate(45deg)' : 'rotate(0deg)',
            }}
          />
        </div>
      </nav>
      <Elements folderKey={folderKey} selecting={selecting} />
      {uploading && <Uploader folderKey={folderKey} toggle={toggleUploading} />}
      {selecting && !uploading && <EditMenu folderKey={folderKey} />}
    </div>
  );
}
