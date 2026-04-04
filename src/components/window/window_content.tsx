import { forwardRef, memo } from "react";
import { WindowType } from "@/interfaces/window";
import ImageViewer from "./window_content/image";
import Navigator from "./window_content/navigator";
import Uploader from "./window_content/uploader";
import VideoViewer from "./window_content/video";
import styles from "./window_content.module.css";

export default memo(
  forwardRef(function WindowContent(
    {
      fileKey,
      fileName,
      windowKey,
      setLoading,
      type,
      onMouseEnter,
      onMouseLeave,
    }: {
      fileKey: string;
      fileName: string;
      windowKey: string;
      setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
      type: WindowType;
      onMouseEnter?: () => void;
      onMouseLeave?: () => void;
    },
    ref: React.Ref<HTMLDivElement>
  ) {
    return (
      <section
        className={`flex-center full-size ${styles.container}`}
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label="window content"
      >
        {type === WindowType.Navigator && setLoading && (
          <Navigator
            path={fileKey}
            windowKey={windowKey}
            setLoading={setLoading}
          />
        )}
        {type === WindowType.Trash && setLoading && (
          <Navigator
            path={fileKey}
            windowKey={windowKey}
            setLoading={setLoading}
          />
        )}
        {type === WindowType.Uploader && <Uploader targetPath={fileKey} />}
        {type === WindowType.Image && fileName && (
          <ImageViewer fileKey={fileKey} fileName={fileName} />
        )}
        {type === WindowType.Video && fileName && (
          <VideoViewer fileKey={fileKey} />
        )}
      </section>
    );
  })
);
