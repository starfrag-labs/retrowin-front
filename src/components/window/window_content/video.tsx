import { useGetDownloadUrl } from "@/api/generated";
import { useWindowStore } from "@/store/window.store";
import mediaStyles from "./media.module.css";

export default function VideoViewer({ fileKey: path }: { fileKey: string }) {
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
        <video
          controls
          className="full-size flex-center"
          style={{ objectFit: "contain" }}
        >
          <source src={downloadQuery.data.downloadUrl} type="video/mp4" />
          <track kind="captions" />
        </video>
      )}
    </div>
  );
}
