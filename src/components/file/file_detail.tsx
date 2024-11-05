import { forwardRef, memo } from "react";
import styles from "./file_detail.module.css";
import { ApiFileType } from "@/interfaces/api";

/**
 * File detail component
 * @param fileName - name of the file
 * @param fileType - type of the file
 * @param bytes - size of the file
 * @param created - created date of the file
 * @param modified - modified date of the file
 * @returns - File detail component
 * @example
 * <FileDetail fileName="example.txt" fileType="text" bytes={1024} created={new Date()} modified={new Date()} />
 */
export default memo(
  forwardRef(function FileDetail(
    {
      fileName,
      fileType,
      bytes,
      created,
      modified,
    }: {
      fileName: string;
      fileType: ApiFileType;
      bytes: number;
      created: Date;
      modified: Date;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    return (
      <div className={styles.detail_container} ref={ref}>
        <div className={styles.detail_item}>
          <div className={styles.detail_item_name}>name</div>
          <div className={styles.detail_item_text}>{fileName}</div>
        </div>
        <div className={styles.detail_item}>
          <div className={styles.detail_item_name}>type</div>
          <div className={styles.detail_item_text}>{fileType}</div>
        </div>
        <div className={styles.detail_item}>
          <div className={styles.detail_item_name}>size</div>
          {bytes < 1024 && (
            <div className={styles.detail_item_text}>{bytes} B</div>
          )}
          {bytes >= 1024 && bytes < 1024 ** 2 && (
            <div className={styles.detail_item_text}>
              {(bytes / 1024).toFixed(2)} KB
            </div>
          )}
          {bytes >= 1024 ** 2 && bytes < 1024 ** 3 && (
            <div className={styles.detail_item_text}>
              {(bytes / 1024 ** 2).toFixed(2)} MB
            </div>
          )}
          {bytes >= 1024 ** 3 && bytes < 1024 ** 4 && (
            <div className={styles.detail_item_text}>
              {(bytes / 1024 ** 3).toFixed(2)} GB
            </div>
          )}
        </div>
        <div className={styles.detail_item}>
          <div className={styles.detail_item_name}>created</div>
          <div className={styles.detail_item_text}>
            {created.toLocaleString()}
          </div>
        </div>
        <div className={styles.detail_item}>
          <div className={styles.detail_item_name}>modified</div>
          <div className={styles.detail_item_text}>
            {modified.toLocaleString()}
          </div>
        </div>
      </div>
    );
  }),
);
