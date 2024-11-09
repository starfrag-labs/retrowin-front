import { url } from "@/api/fetch";
import { storageQuery } from "@/api/query";
import { useQuery } from "@tanstack/react-query";
import mediaStyles from "./media.module.css";

export default function VideoViewer({ fileKey }: { fileKey: string }) {
  // Constants
  const fileUrl = url.storage.file.read(fileKey);

  // Queries
  const sessionQuery = useQuery(storageQuery.session.read(fileKey));

  return (
    <div className={`full-size flex-center ${mediaStyles.container}`}>
      {sessionQuery.isFetched && sessionQuery.data && (
        <video
          controls
          className="full-size flex-center"
          style={{ objectFit: "contain" }}
        >
          <source src={fileUrl.toString()} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
