import { useQuery } from '@tanstack/react-query';
import { readFileQueryOption } from '../../utils/queryOptions/file.query';
import { useCallback, useEffect, useState } from 'react';
import { imagePreview, imagePreviewContainer } from '../../styles/mobile/preview.css';

export const ImagePreview = ({
  elementKey,
  parentKey,
}: {
  elementKey: string;
  parentKey: string;
}) => {
  const query = useQuery(readFileQueryOption(parentKey, elementKey));
  const [sourceUrl, setSourceUrl] = useState<string>('');

  const createUrl = useCallback(async () => {
    if (query.isSuccess && query.data) {
      const url = URL.createObjectURL(query.data);
      setSourceUrl(url);
    }
  }, [query.data, query.isSuccess]);

  useEffect(() => {
    createUrl();
  }, [createUrl]);

  return (
    <div className={imagePreviewContainer}>
      {sourceUrl ? (
        <img src={sourceUrl} alt="preview" className={imagePreview} />
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
};
