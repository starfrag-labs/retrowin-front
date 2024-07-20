import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Loading } from '../../components/Loading';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useMobileElementStore } from '../../store/mobile/element.store';
import { background } from '../../styles/mobile/background.css';
import { IMobileElementState } from '../../types/store';
import {
  getFolderInfoQueryOption,
  readFolderQueryOption,
} from '../../utils/queryOptions/folder.query';
import { Elements } from '../../components/mobile/Elements';
import { IoMdReturnLeft } from 'react-icons/io';
import {
  navContainer,
  navLeftContainer,
  returnIcon,
  uploadIcon,
} from '../../styles/mobile/nav.css';
import { FaPlus } from 'react-icons/fa6';
import { Logo } from '../../components/Logo';
import { Uploader } from '../../components/mobile/Menu/CreateMenu';
import { EditMenu } from '../../components/mobile/Menu/EditMenu';

export const Route = createFileRoute('/m/$folderKey')({
  loader: async ({ params }) => {
    return {
      folderKey: params.folderKey,
    };
  },
  pendingComponent: () => <Loading />,
  component: Component,
});

function Component() {
  // Params
  const folderKey = Route.useParams().folderKey;

  // States
  const [uploading, setUploading] = useState<boolean>(false);
  const [selecting, setSelecting] = useState<boolean>(false);
  
  // Query
  const readQuery = useSuspenseQuery(readFolderQueryOption(folderKey));
  const infoQuery = useSuspenseQuery(getFolderInfoQueryOption(folderKey));
  
  // Store
  const elements = useMobileElementStore((state) => state.elements);
  
  // Actions
  const addElements = useMobileElementStore((state) => state.addElements);
  const unselectAll = useMobileElementStore((state) => state.unselectAllElements);
  
  // Navigation
  const navigate = useNavigate({ from: '/m/$folderKey' });
  
  // Functions
  const toggleUploading = useCallback(() => {
    setUploading(!uploading);
  }, [uploading, setUploading]);

  useEffect(() => {
    setSelecting(false);
    elements.forEach((element) => {
      if (element.selected) {
        setSelecting(true);
        return;
      }
    });
  }, [elements, setSelecting]);

  useEffect(() => {
    const data = readQuery.data;
    if (!data) {
      return;
    }
    const folderElements: IMobileElementState[] = data.folders.map((folder) => {
      return {
        key: folder.key,
        name: folder.name,
        type: 'folder',
        parentKey: folderKey,
        selected: false,
      };
    });
    const fileElements: IMobileElementState[] = data.files.map((file) => {
      return {
        key: file.key,
        name: file.name,
        type: 'file',
        parentKey: folderKey,
        selected: false,
      };
    });
    addElements([...folderElements, ...fileElements]);
  }, [readQuery.data, addElements, folderKey]);

  return (
    <div className={background}>
      <nav className={navContainer}>
        {infoQuery.data.parentKey ? (
          <div className={navLeftContainer}>
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
        <FaPlus
          className={uploadIcon}
          onTouchEnd={selecting ? unselectAll : toggleUploading}
          style={{
            transform: selecting ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        />
      </nav>
      <Elements folderKey={folderKey} selecting={selecting} />
      {uploading && <Uploader folderKey={folderKey} toggle={toggleUploading} />}
      {selecting && !uploading && (
        <EditMenu folderKey={folderKey} />
      )}
    </div>
  );
}
