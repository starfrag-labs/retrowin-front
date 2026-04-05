import type { Query } from "@tanstack/react-query";

/**
 * Query key constants for API endpoints
 */
export const QUERY_KEYS = {
  FS_PREFIX: "/api/fs/",
  LS_SUFFIX: "/ls",
  STAT_SUFFIX: "/stat",
} as const;

/**
 * Predicate function to check if a query is a filesystem query (ls or stat)
 * @param query - The query object from react-query
 * @returns true if the query is a filesystem query
 */
export function isFsQuery(query: Query): boolean {
  const queryKey = query.queryKey[0] as string;
  return (
    queryKey.startsWith(QUERY_KEYS.FS_PREFIX) &&
    (queryKey.endsWith(QUERY_KEYS.LS_SUFFIX) ||
      queryKey.endsWith(QUERY_KEYS.STAT_SUFFIX))
  );
}
