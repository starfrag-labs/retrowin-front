import { useGetStreamToken } from "@/api/generated";
import mediaStyles from "./media.module.css";

export default function VideoViewer({ fileKey }: { fileKey: string }) {
  // Use Orval's generated hook directly
  const streamQuery = useGetStreamToken(fileKey, {
    query: {
      select: (data) => ("streamToken" in data.data ? data.data.streamToken : null),
    },
    fetch: { credentials: "include" },
  });

  return (
    <div className={`full-size flex-center ${mediaStyles.container}`}>
      {streamQuery.data && (
        <video
          controls
          className="full-size flex-center"
          style={{ objectFit: "contain" }}
        >
          <source src={streamQuery.data.downloadUrl} type="video/mp4" />
          <track kind="captions" />
        </video>
      )}
    </div>
  );
}
