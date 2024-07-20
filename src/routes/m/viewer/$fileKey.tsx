import { createFileRoute, Link } from '@tanstack/react-router';
import { Loading } from '../../../components/Loading';
import { readFileQueryOption } from '../../../utils/queryOptions/file.query';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useMobileElementStore } from '../../../store/mobile/element.store';
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

export const Route = createFileRoute('/m/viewer/$fileKey')({
  pendingComponent: () => <Loading />,
  component: Component,
});

function Component() {
  const { fileKey } = Route.useParams();

  // States
  const [targetKey, setTargetKey] = useState<string>(fileKey);
  const [parentKey, setParentKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [siblings, setSiblings] = useState<string[]>([]);
  const [imageNumber, setImageNumber] = useState<number>(0);

  // Store actions
  const findElement = useMobileElementStore((state) => state.findElement);
  const findElementsByParentKey = useMobileElementStore(
    (state) => state.findElementsByParentKey
  );

  // Query
  const readQuery = useQuery(
    readFileQueryOption(findElement(targetKey)?.parentKey ?? '', targetKey)
  );

  useEffect(() => {
    const element = findElement(fileKey);
    if (!element) return;
    setParentKey(element.parentKey);
  }, [fileKey, findElement]);

  useEffect(() => {
    const element = findElement(fileKey);
    if (!element) return;
    setSiblings(
      findElementsByParentKey(element.parentKey)
        .filter((element) => {
          const contentType = getContentType(element.name);
          return (
            contentType === 'image/jpg' ||
            contentType === 'image/jpeg' ||
            contentType === 'image/png' ||
            contentType === 'image/gif' ||
            contentType === 'video/mp4' ||
            contentType === 'video/webm' ||
            contentType === 'video/ogg'
          );
        })
        .map((element) => element.key)
    );
  }, [fileKey, findElement, findElementsByParentKey]);

  useEffect(() => {
    setImageNumber(siblings.indexOf(targetKey));
  }, [siblings, targetKey]);

  const createUrl = useCallback(async () => {
    setLoading(true);
    const element = findElement(targetKey);
    if (!element) return;
    const contentType = getContentType(element.name);
    if (
      readQuery.isSuccess &&
      readQuery.data &&
      (contentType === 'image/jpg' ||
        contentType === 'image/jpeg' ||
        contentType === 'image/png' ||
        contentType === 'image/gif' ||
        contentType === 'video/mp4' ||
        contentType === 'video/webm' ||
        contentType === 'video/ogg')
    ) {
      setSourceUrl(URL.createObjectURL(readQuery.data));
      setLoading(false);
    }
  }, [findElement, readQuery.data, readQuery.isSuccess, targetKey]);

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
        {loading ? (
          <Loading />
        ) : (
          <div>
            {sourceUrl ? (
              getContentType(findElement(targetKey)?.name ?? '')?.match(
                'image'
              ) ? (
                <img src={sourceUrl} alt="preview" className={imageContent} />
              ) : (
                <video controls src={sourceUrl} className={imageContent}/>
              )
            ) : (
              <div>loading...</div>
            )}
          </div>
        )}
      </div>
      <div className={viewerBottom}>
        <MdDelete className={activeControllerButton} />
        <div className={pageNumber}>
          {imageNumber + 1} / {siblings.length}
        </div>
        <MdDownload className={activeControllerButton} />
      </div>
    </div>
  );
}
