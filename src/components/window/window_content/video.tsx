import { storageApiBase, url } from "@/api/fetch";
import { storageQuery } from "@/api/query";
import { useQuery } from "@tanstack/react-query";

export default function VideoViewer({
  fileKey,
  fileName,
}: {
  fileKey: string;
  fileName: string;
}) {
  const sessionQuery = useQuery(storageQuery.session.read(fileKey));

  return (
    <div className="full-size flex-center">
      {sessionQuery.isFetched && sessionQuery.data && (
        <video
          controls
          className="full-size flex-center"
          style={{ objectFit: "contain" }}
        >
          <source
            src={`${storageApiBase}${url.storage.file.read(fileKey, fileName)}`}
            type="video/mp4"
          />
        </video>
      )}
    </div>
  );
}
