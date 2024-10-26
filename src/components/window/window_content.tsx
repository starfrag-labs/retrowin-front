import { forwardRef } from "react";
import styles from "./window_content.module.css";
import { WindowType } from "@/interfaces/window";
import Navigator from "./window_content/navigator";
import Uploader from "./window_content/uploader";

export default forwardRef(function WindowContent(
  {
    fileKey,
    windowKey,
    setLoading,
    type,
    onMouseEnter,
    onMouseLeave,
  }: {
    fileKey: string;
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
        {type === WindowType.Uploader && setLoading && (
          <Uploader
            targetContainerKey={fileKey}
            setLoading={setLoading}
          />
        )}
    </div>
  );
});
