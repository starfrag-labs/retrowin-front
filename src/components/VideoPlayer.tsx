import Hls from 'hls.js';
import React, { useEffect, useRef } from 'react';
import config from '../utils/config';

export function VideoPlayer({
  folderKey,
  fileKey,
}: {
  folderKey: string;
  fileKey: string;
}): React.ReactElement {
  const videoRef = useRef<HTMLVideoElement>(null);
  const url = `${config.cloud}/videos/stream/${folderKey}/${fileKey}/master.m3u8`;
  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls({
      });
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
    }
  }, [url]);

  return (
    <video ref={videoRef} controls>
      <source src={url} />
    </video>
  );
}
