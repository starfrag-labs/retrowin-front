import { useEffect, useState } from 'react';
import { Loading } from '../Loading';
import { useQuery } from '@tanstack/react-query';
import { readFileQueryOption } from '../../utils/queryOptions/file.query';
import { useElementStore } from '../../store/element.store';
import { getContentType } from '../../utils/customFn/contentTypeGetter';
import { videoPlayerContainer, videoSrc } from '../../styles/windows/videoPlayer.css';

export const VideoPlayer = ({
  fileKey,
}: {
  fileKey: string;
}): React.ReactElement => {
  const [loading, setLoading] = useState(true);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const element = useElementStore((state) => state.findElement(fileKey));

  const query = useQuery(
    readFileQueryOption(element?.parentKey ?? '', fileKey)
  );

  useEffect(() => {
    if (!element) return;
    const contentType = getContentType(element.name);
    if (
      query.isSuccess &&
      query.data &&
      (contentType === 'video/mp4' ||
        contentType === 'video/webm' ||
        contentType === 'video/ogg')
    ) {
      setSourceUrl(URL.createObjectURL(query.data));
      setLoading(false);
    }
  }, [element, query.data, query.isSuccess]);

  return (
    <div className={videoPlayerContainer}>
      {loading && <Loading />}
      <video controls src={sourceUrl} hidden={loading} className={videoSrc} />
    </div>
  );
};
