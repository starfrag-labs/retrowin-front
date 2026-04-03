import { useGetDownloadUrl } from "@/api/generated";
import { useWindowStore } from "@/store/window.store";
import Image from "next/image";
import mediaStyles from "./media.module.css";

export default function ImageViewer({
  fileKey: path,
  fileName,
}: {
  fileKey: string;
  fileName: string;
}) {
  // Get system ID from window store
  const windows = useWindowStore((state) => state.windows);
  const currentWindow = windows.find((w) => w.targetKey === path);
  const systemId = currentWindow?.systemId || "";

  // Use Orval's generated hook directly
  const downloadQuery = useGetDownloadUrl(
    systemId,
    { path },
    {
      query: {
        select: (data) => (data.status === 200 ? data.data.downloadUrl : null),
      },
      fetch: { credentials: "include" },
    }
  );

  return (
    <div className={`full-size flex-center ${mediaStyles.container}`}>
      {downloadQuery.data && (
        <Image
          src={downloadQuery.data.downloadUrl}
          alt={fileName}
          fill
          style={{ objectFit: "contain" }}
          unoptimized
        />
      )}
    </div>
  );
}
