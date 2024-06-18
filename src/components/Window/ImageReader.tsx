import { useCallback } from "react";
import { useElementStore } from "../../store/element.store";
import { downloadFile } from "../../api/cloud";
import { useTokenStore } from "../../store/token.store";
import { getContentType } from "../../utils/customFn/contentTypeGetter";

export const ImageReader = ({
  fileKey,
}: {
  fileKey: string;
}): React.ReactElement => {
  const accessToken = useTokenStore((state) => state.accessToken);
  const element = useElementStore((state) => state.findElement(fileKey)); 

  const handelOpen = async () => {
    if (!element) return;
    const contentType = getContentType(element.name);
    if (
      element.type === "file" &&
      (contentType === "image/jpg" ||
        contentType === "image/jpeg" ||
        contentType === "image/png" ||
        contentType === "image/gif")
    ) {
      downloadFile(accessToken, element.parentKey, element.key).then(
        (response) => {
          const url = window.URL.createObjectURL(
            new Blob([response.data], { type: contentType })
          );
          window.open(url, "_blank");
        }
      );
    }
  }

  return <div></div>;
};
