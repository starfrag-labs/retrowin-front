import { forwardRef, memo } from "react";
import styles from "./window_content.module.css";
import { WindowType } from "@/interfaces/window";
import Navigator from "./window_content/navigator";
import Uploader from "./window_content/uploader";
import ImageViewer from "./window_content/image";
import VideoViewer from "./window_content/video";

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
    ref: React.Ref<HTMLDivElement>,
  ) {
    return (
      <div
        className={`flex-center full-size ${styles.container}`}
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {type === WindowType.Navigator && setLoading && (
          <Navigator
            fileKey={fileKey}
            windowKey={windowKey}
            setLoading={setLoading}
          />
        )}
        {type === WindowType.Trash && setLoading && (
          <Navigator
            fileKey={fileKey}
            windowKey={windowKey}
            setLoading={setLoading}
          />
        )}
        {type === WindowType.Uploader && (
          <Uploader targetContainerKey={fileKey} />
        )}
        {type === WindowType.Image && fileName && (
          <ImageViewer fileKey={fileKey} fileName={fileName} />
        )}
        {type === WindowType.Video && fileName && (
          <VideoViewer fileKey={fileKey} />
        )}
      </div>
    );
  }),
);
