import { useQuery } from '@tanstack/react-query';
import { readFileQueryOption } from '../../utils/queryOptions/file.query';
import { useCallback, useEffect, useState } from 'react';
import { imagePreview } from '../../styles/mobile/preview.css';
import { Loading } from '../Loading';

export const ImagePreview = ({
  elementKey,
  parentKey,
}: {
  elementKey: string;
  parentKey: string;
}): React.ReactElement => {
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

  if (sourceUrl) {
    return <img src={sourceUrl} alt="preview" className={imagePreview} />;
  } else {
    return <Loading />;
  }
};
