import { url } from "@/api/fetch";
import { storageQuery } from "@/api/query";
import { useQuery } from "@tanstack/react-query";

export default function Audio({ fileKey }: { fileKey: string }) {
  // Constants
  const fileUrl = url.storage.file.src(fileKey);

  // Queries
  const sessionQuery = useQuery(storageQuery.session.read(fileKey));

  return (
    <div className={"full-size flex-center"}>
      {sessionQuery.isFetched && sessionQuery.data && (
        <audio controls>
          <source src={fileUrl.toString()} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
