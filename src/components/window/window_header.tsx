import { forwardRef, memo } from "react";
import styles from "./window_header.module.css";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import CircularLoader from "../circular_loader";

export default memo(
  forwardRef(function WindowHeader(
    {
      title,
      loading,
      prevWindowButtonAction,
      nextWindowButtonAction,
      firstWindowButtonAction,
      secondWindowButtonAction,
      thirdWindowButtonAction,
      windowButtonColorPallete,
      onMouseDown,
      onMouseEnter,
    }: {
      title: string;
      loading: boolean;
      prevWindowButtonAction: () => void;
      nextWindowButtonAction: () => void;
      firstWindowButtonAction?: () => void;
      secondWindowButtonAction?: () => void;
      thirdWindowButtonAction?: () => void;
      windowButtonColorPallete?: string[];
      onMouseDown?: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      ) => void;
      onMouseEnter?: () => void;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    // Default button color pallete as light red, light orange ans light green
    const defaultButtonColorPallete = ["#FFCDD2", "#FFE0B2", "#C8E6C9"];

    return (
      <div
        className={`flex-center ${styles.container}`}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        ref={ref}
      >
        <div className={styles.header_left_container}>
          <div className={styles.navigate_button_container}>
            <MdNavigateBefore
              className={styles.navigate_button}
              onClick={prevWindowButtonAction}
            />
            <MdNavigateNext
              className={styles.navigate_button}
              onClick={nextWindowButtonAction}
            />
          </div>
          <div className={styles.header_title}>{title}</div>
          {loading && <CircularLoader size="20px" border="3px" />}
        </div>
        <div className={styles.header_right_container}>
          <div className={styles.window_button_container}>
            {firstWindowButtonAction && (
              <div
                className={styles.window_button}
                onClick={firstWindowButtonAction}
                style={{
                  backgroundColor: windowButtonColorPallete
                    ? windowButtonColorPallete[0]
                    : defaultButtonColorPallete[0],
                }}
              />
            )}
            {secondWindowButtonAction && (
              <div
                className={styles.window_button}
                onClick={secondWindowButtonAction}
                style={{
                  backgroundColor: windowButtonColorPallete
                    ? windowButtonColorPallete[1]
                    : defaultButtonColorPallete[1],
                }}
              />
            )}
            {thirdWindowButtonAction && (
              <div
                className={styles.window_button}
                onClick={thirdWindowButtonAction}
                style={{
                  backgroundColor: windowButtonColorPallete
                    ? windowButtonColorPallete[2]
                    : defaultButtonColorPallete[2],
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }),
);
