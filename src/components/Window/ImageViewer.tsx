import { memo, useCallback, useEffect, useState } from 'react';
import { getContentType } from '../../utils/customFn/contentTypeGetter';
import {
  imageReaderContainer,
  imageSrc,
  nextButton,
  prevButton,
} from '../../styles/windows/imageReader.css';
import { useQuery } from '@tanstack/react-query';
import {
  downloadFileQueryOption,
  getFileInfoQueryOption,
} from '../../utils/queryOptions/file.query';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { CircularLoading } from '../CircularLoading';
import { useElementStoreV3 } from '../../store/element.store.v3';

export const ImageViewer = memo(
  ({
    fileKey,
    setTitle,
  }: {
    fileKey: string;
    setTitle: (title: string) => void;
  }): React.ReactElement => {
    // states
    const [parentKey, setParentKey] = useState<string>('');
    const [targetKey, setTargetKey] = useState<string>(fileKey);
    const [siblings, setSiblings] = useState<string[]>([]);
    const [imageNumber, setImageNumber] = useState<number>(0);
    const [sourceUrl, setSourceUrl] = useState<string>('');

    // store functions
    const [loading, setLoading] = useState(true);

    const infoQuery = useQuery(getFileInfoQueryOption(targetKey));
    const downloadQuery = useQuery(downloadFileQueryOption(targetKey));
    const info = useElementStoreV3((state) => state.info);
    const getElementInfo = useElementStoreV3((state) => state.getElementInfo);
    const getElementInfoByParentKey = useElementStoreV3(
      (state) => state.getElementInfoByParentKey
    );

    useEffect(() => {
      setParentKey(getElementInfo(targetKey)?.parentKey ?? '');
    }, [targetKey, getElementInfo]);

    useEffect(() => {
      if (info) {
        setSiblings(
          getElementInfoByParentKey(parentKey)
            .filter((info) => info.type === 'file')
            .filter((info) => getContentType(info.name)?.startsWith('image'))
            .map((info) => info.key)
        );
      }
    }, [parentKey, getElementInfoByParentKey, info]);

    useEffect(() => {
      setImageNumber(siblings.indexOf(targetKey));
    }, [siblings, targetKey]);

    const createUrl = useCallback(async () => {
      setLoading(true);
      if (infoQuery.isSuccess && infoQuery.data) {
        const contentType = getContentType(infoQuery.data.fileName);
        if (
          downloadQuery.isSuccess &&
          downloadQuery.data &&
          contentType &&
          contentType.startsWith('image')
        ) {
          setSourceUrl(URL.createObjectURL(downloadQuery.data));
          setLoading(false);
        }
      }
    }, [
      downloadQuery.data,
      downloadQuery.isSuccess,
      infoQuery.data,
      infoQuery.isSuccess,
    ]);

    useEffect(() => {
      createUrl();
    }, [createUrl]);

    const handleNext = () => {
      if (
        imageNumber + 1 < siblings.length &&
        infoQuery.isSuccess &&
        infoQuery.data
      ) {
        setTargetKey(siblings[imageNumber + 1]);
        setTitle(infoQuery.data.fileName ?? 'Image');
      }
    };

    const handlePrev = () => {
      if (imageNumber > 0 && infoQuery.isSuccess && infoQuery.data) {
        setTargetKey(siblings[imageNumber - 1]);
        setTitle(infoQuery.data.fileName ?? 'Image');
      }
    };

    return (
      <div className={imageReaderContainer}>
        {loading && <CircularLoading />}
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
