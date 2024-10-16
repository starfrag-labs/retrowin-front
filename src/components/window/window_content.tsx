import { forwardRef } from "react";
import styles from "./window_content.module.css";
import { AppWindow } from "@/interfaces/window";
import Navigator from "./window_content/navigator";

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
    type: AppWindow["type"];
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
      {type === "navigator" && setLoading && (
        <Navigator
          fileKey={fileKey}
          windowKey={windowKey}
          setLoading={setLoading}
        />
      )}
    </div>
  );
});
