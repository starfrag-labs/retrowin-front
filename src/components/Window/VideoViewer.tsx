import { useEffect, useState } from 'react';
import { CircularLoading } from '../CircularLoading';
import { useQuery } from '@tanstack/react-query';
import {
  downloadFileQueryOption,
  getFileInfoQueryOption,
} from '../../utils/queryOptions/file.query';
import { getContentType } from '../../utils/customFn/contentTypeGetter';
import {
  videoPlayerContainer,
  videoSrc,
} from '../../styles/windows/videoPlayer.css';

export const VideoViewer = ({
  fileKey,
}: {
  fileKey: string;
}): React.ReactElement => {
  const [loading, setLoading] = useState(true);
  const [sourceUrl, setSourceUrl] = useState<string>('');

  const infoQuery = useQuery(getFileInfoQueryOption(fileKey));
  const downloadQuery = useQuery(downloadFileQueryOption(fileKey));

  useEffect(() => {
    if (infoQuery.isSuccess && infoQuery.data) {
      const contentType = getContentType(infoQuery.data.fileName);
      if (
        downloadQuery.isSuccess &&
        downloadQuery.data &&
        contentType?.startsWith('video')
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

  return (
    <div className={videoPlayerContainer}>
      {loading && <CircularLoading />}
      <video controls src={sourceUrl} hidden={loading} className={videoSrc} />
    </div>
  );
};
