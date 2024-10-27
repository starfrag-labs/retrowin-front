import { storageApiBase, url } from "@/api/fetch";
import { storageQuery } from "@/api/query";
import { useQuery } from "@tanstack/react-query";

export default function ImageViewer({
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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${storageApiBase}${url.storage.file.read(fileKey, fileName)}`}
          alt={fileName}
          className="full-size flex-center"
          style={{ objectFit: "contain" }}
        />
      )}
    </div>
  );
}
