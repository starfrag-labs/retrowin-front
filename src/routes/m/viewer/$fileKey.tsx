import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { CircularLoading } from '../../../components/pc/CircularLoading';
import {
  getFileInfoQueryOption,
  downloadFileQueryOption,
  deleteFileMutationOption,
} from '../../../utils/queryOptions/file.query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { getContentType } from '../../../utils/customFn/contentTypeGetter';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { IoIosReturnLeft } from 'react-icons/io';
import { MdDownload } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import {
  activeControllerButton,
  mediaContent,
  viewerContainer,
  inactiveControllerButton,
  pageNumber,
  viewControllerContainer,
  viewerBottom,
  viewerNav,
  mediaContainer,
} from '../../../styles/mobile/viewer.css';
import { readFolderQueryOption } from '../../../utils/queryOptions/folder.query';
import { Modal } from '../../../components/mobile/Modal';
import { generateQueryKey } from '../../../utils/queryOptions/index.query';

export const Route = createFileRoute('/m/viewer/$fileKey')({
  pendingComponent: () => <CircularLoading />,
  component: Component,
});

function Component() {
  const queryClient = useQueryClient();
  const { fileKey } = Route.useParams();

  // Mutations
  const deleteFile = useMutation(deleteFileMutationOption);

  // Navigation
  const navigate = useNavigate({ from: '/m/viewer/$fileKey' });

  // States
  const [fileName, setFileName] = useState<string>('');
  const [targetKey, setTargetKey] = useState<string>(fileKey);
  const [parentKey, setParentKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [siblings, setSiblings] = useState<string[]>([]);
  const [imageNumber, setImageNumber] = useState<number>(0);
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] =
    useState<boolean>(false);

  // Query
  const readQuery = useQuery(downloadFileQueryOption(targetKey));
  const infoQuery = useQuery(getFileInfoQueryOption(targetKey));
  const readFolderQuery = useQuery(readFolderQueryOption(parentKey));

  // Functions
  const toggleDeleteModalOpen = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const toggleDownloadModalOpen = () => {
    setIsDownloadModalOpen(!isDownloadModalOpen);
  };

  const toggleShowMenu = () => {
    setShowMenu(!showMenu);
  };

  // Effects
  useEffect(() => {
    if (infoQuery.isSuccess && infoQuery.data) {
      setFileName(infoQuery.data.fileName);
    }
  }, [infoQuery.data, infoQuery.isSuccess]);

  useEffect(() => {
    if (infoQuery.isSuccess && infoQuery.data) {
      setParentKey(infoQuery.data.parentFolderKey);
    }
  }, [fileKey, infoQuery.data, infoQuery.isSuccess]);

  useEffect(() => {
    if (readFolderQuery.isSuccess && readFolderQuery.data) {
      setSiblings(
        readFolderQuery.data.files
          .filter((file) => {
            const contentType = getContentType(file.name);
            return contentType ? true : false;
          })
          .map((file) => file.key)
      );
    }
  }, [fileKey, readFolderQuery.data, readFolderQuery.isSuccess]);

  useEffect(() => {
    setImageNumber(siblings.indexOf(targetKey));
  }, [siblings, targetKey]);

  const createUrl = useCallback(async () => {
    setLoading(true);
    if (!fileName) {
      setLoading(false);
      return;
    }
    const contentType = getContentType(fileName);
    if (readQuery.isSuccess && readQuery.data && contentType) {
      setSourceUrl(URL.createObjectURL(readQuery.data));
      setLoading(false);
    }
  }, [fileName, readQuery.data, readQuery.isSuccess]);

  useEffect(() => {
    createUrl();
  }, [createUrl]);

  const handlePrev = () => {
    if (imageNumber > 0) {
      setTargetKey(siblings[imageNumber - 1]);
    }
  };

  const handleNext = () => {
    if (imageNumber < siblings.length - 1) {
      setTargetKey(siblings[imageNumber + 1]);
    }
  };

  const handleDelete = async () => {
    setIsDeleteModalOpen(false);
    deleteFile.mutateAsync(targetKey).then(() => {
      queryClient.invalidateQueries({
        queryKey: generateQueryKey('folder', parentKey),
      });
      if (siblings.length > 1) {
        if (imageNumber > 0) {
          setTargetKey(siblings[imageNumber - 1]);
        } else {
          setTargetKey(siblings[imageNumber + 1]);
        }
      } else {
        navigate({ to: '/m/$folderKey', params: { folderKey: parentKey } });
      }
    });
  };

  const handleDownload = async () => {
    toggleDownloadModalOpen();
    queryClient
      .ensureQueryData(downloadFileQueryOption(targetKey, fileName))
      .then((response) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  };

  return (
    <div className={viewerContainer}>
      {loading || !fileName || !sourceUrl ? (
        <CircularLoading />
      ) : (
        <div className={mediaContainer}>
          {getContentType(fileName)?.startsWith('image') ? (
            <img
              src={sourceUrl}
              className={mediaContent}
              onTouchEnd={toggleShowMenu}
            />
          ) : (
            getContentType(fileName)?.startsWith('video') && (
              <video
                src={sourceUrl}
                controls
                className={mediaContent}
                onTouchEnd={toggleShowMenu}
              />
            )
          )}
        </div>
      )}
      {showMenu && (
        <nav className={viewerNav}>
          <Link to="/m/$folderKey" params={{ folderKey: parentKey }}>
            <IoIosReturnLeft
              className={
                parentKey ? activeControllerButton : inactiveControllerButton
              }
            />
          </Link>
          <div className={viewControllerContainer}>
            {imageNumber > 0 ? (
              <MdNavigateBefore
                className={activeControllerButton}
                onTouchEnd={handlePrev}
              />
            ) : (
              <MdNavigateBefore className={inactiveControllerButton} />
            )}
            {imageNumber < siblings.length - 1 ? (
              <MdNavigateNext
                className={activeControllerButton}
                onTouchEnd={handleNext}
              />
            ) : (
              <MdNavigateNext className={inactiveControllerButton} />
            )}
          </div>
        </nav>
      )}
      {showMenu && (
        <div className={viewerBottom}>
          <MdDelete
            className={activeControllerButton}
            onTouchEnd={toggleDeleteModalOpen}
          />
          <div className={pageNumber}>
            {imageNumber + 1} / {siblings.length}
          </div>
          <MdDownload
            className={activeControllerButton}
            onTouchEnd={toggleDownloadModalOpen}
          />
        </div>
      )}
      {isDeleteModalOpen && (
        <Modal onAccept={handleDelete} onClose={toggleDeleteModalOpen}>
          Are you sure you want to delete this file?
        </Modal>
      )}
      {isDownloadModalOpen && (
        <Modal onAccept={handleDownload} onClose={toggleDownloadModalOpen}>
          Are you sure you want to download this file?
        </Modal>
      )}
    </div>
  );
}
