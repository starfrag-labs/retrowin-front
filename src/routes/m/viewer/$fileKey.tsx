import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { CircularLoading } from '../../../components/CircularLoading';
import {
  getFileInfoQueryOption,
  downloadFileQueryOption,
} from '../../../utils/queryOptions/file.query';
import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { getContentType } from '../../../utils/customFn/contentTypeGetter';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { IoIosReturnLeft } from 'react-icons/io';
import { MdDownload } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import {
  activeControllerButton,
  imageContent,
  imageViewerContainer,
  inactiveControllerButton,
  pageNumber,
  returnButtonIcon,
  viewControllerContainer,
  viewerBottom,
  viewerNav,
} from '../../../styles/mobile/viewer.css';
import { readFolderQueryOption } from '../../../utils/queryOptions/folder.query';
import { deleteFile, downloadFile } from '../../../api/cloud';
import { Modal } from '../../../components/mobile/Modal';

export const Route = createFileRoute('/m/viewer/$fileKey')({
  pendingComponent: () => <CircularLoading />,
  component: Component,
});

function Component() {
  const queryClient = useQueryClient();
  const { fileKey } = Route.useParams();

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] =
    useState<boolean>(false);

  // Query
  const readQuery = useSuspenseQuery(downloadFileQueryOption(targetKey));
  const infoQuery = useSuspenseQuery(getFileInfoQueryOption(targetKey));
  const readFolderQuery = useQuery(readFolderQueryOption(parentKey));

  // Functions
  const toggleDeleteModalOpen = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const toggleDownloadModalOpen = () => {
    setIsDownloadModalOpen(!isDownloadModalOpen);
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
    await deleteFile(targetKey).then(() => {
      queryClient.invalidateQueries(readFolderQueryOption(parentKey));
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
    await downloadFile(targetKey, fileName).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };

  return (
    <div className={imageViewerContainer}>
      <nav className={viewerNav}>
        <Link to="/m/$folderKey" params={{ folderKey: parentKey }}>
          <IoIosReturnLeft className={returnButtonIcon} />
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
      <div>
        {loading || !fileName || !sourceUrl ? (
          <CircularLoading />
        ) : (
          <div>
            {getContentType(fileName)?.startsWith('image') ? (
              <img src={sourceUrl} className={imageContent} />
            ) : (
              getContentType(fileName)?.startsWith('video') && (
                <video src={sourceUrl} controls className={imageContent} />
              )
            )}
          </div>
        )}
      </div>
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
