import { memo, useCallback, useEffect, useState } from 'react';
import { useElementStore } from '../../store/element.store';
import { getContentType } from '../../utils/customFn/contentTypeGetter';
import {
  imageReaderContainer,
  imageSrc,
  nextButton,
  prevButton,
} from '../../styles/windows/imageReader.css';
import { useQuery } from '@tanstack/react-query';
import { readFileQueryOption } from '../../utils/queryOptions/file.query';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { Loading } from '../Loading';

export const ImageReader = memo(
  ({
    fileKey,
    setTitle,
  }: {
    fileKey: string;
    setTitle: (title: string) => void;
  }): React.ReactElement => {
    // states
    const [targetKey, setTargetKey] = useState<string>(fileKey);
    const [siblings, setSiblings] = useState<string[]>([]);
    const [imageNumber, setImageNumber] = useState<number>(0);
    const [sourceUrl, setSourceUrl] = useState<string>('');

    // store functions
    const findElement = useElementStore((state) => state.findElement);
    const findElementsByParentKey = useElementStore(
      (state) => state.findElementsByParentKey
    );
    const [loading, setLoading] = useState(true);

    const query = useQuery(
      readFileQueryOption(
        findElement(targetKey)?.parentKey ?? '',
        targetKey
      )
    );

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
              contentType === 'image/gif'
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
        query.isSuccess &&
        query.data &&
        (contentType === 'image/jpg' ||
          contentType === 'image/jpeg' ||
          contentType === 'image/png' ||
          contentType === 'image/gif')
      ) {
        setSourceUrl(URL.createObjectURL(query.data));
        setLoading(false);
      }
    }, [findElement, query.data, query.isSuccess, targetKey]);

    useEffect(() => {
      createUrl();
    }, [createUrl]);

    const handleNext = () => {
      if (imageNumber + 1 < siblings.length) {
        setTargetKey(siblings[imageNumber + 1]);
        setTitle(findElement(siblings[imageNumber + 1])?.name ?? 'Image');
      }
    };

    const handlePrev = () => {
      if (imageNumber > 0) {
        setTargetKey(siblings[imageNumber - 1]);
        setTitle(findElement(siblings[imageNumber - 1])?.name ?? 'Image');
      }
    };

    return (
      <div className={imageReaderContainer}>
        {loading && <Loading />}
        {imageNumber > 0 && (
          <MdNavigateBefore onClick={handlePrev} className={prevButton} />
        )}
        {imageNumber + 1 < siblings.length && (
          <MdNavigateNext onClick={handleNext} className={nextButton} />
        )}
        <img
          src={sourceUrl}
          alt="No image"
          className={imageSrc}
          hidden={loading}
        />
      </div>
    );
  }
);
