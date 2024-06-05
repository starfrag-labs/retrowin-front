import Hls from "hls.js";
import { useEffect, useRef } from "react";
import { useTokenStore } from "../store/tokenStore";
import { api } from "../utils/config";

export function VideoPlayer({
  folderKey,
  fileKey,
}: {
  folderKey: string;
  fileKey: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const accessToken = useTokenStore.getState().accessToken;
  const url = `${api.cloud}/videos/stream/${folderKey}/${fileKey}/master.m3u8`;
  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls({
        xhrSetup: (xhr) => {
          xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        },
      });
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
    }
  }, [accessToken, url]);

  return (
    <video ref={videoRef} controls>
      <source src={url} />
    </video>
  );
}