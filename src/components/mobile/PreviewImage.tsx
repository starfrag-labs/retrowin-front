import { useQuery } from '@tanstack/react-query';
import { downloadFileQueryOption } from '../../utils/queryOptions/file.query';
import { useCallback, useEffect, useState } from 'react';
import {
  previewImageContainer,
  previewImage,
} from '../../styles/mobile/preview.css';
import { BoxLoading } from '../pc/BoxLoading';

export const PreviewImage = ({
  elementKey,
}: {
  elementKey: string;
}): React.ReactElement => {
  const query = useQuery(downloadFileQueryOption(elementKey));
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
    return (
      <div className={previewImageContainer}>
        <img src={sourceUrl} alt="preview" className={previewImage} />
      </div>
    );
  } else {
    return <BoxLoading />;
  }
};
