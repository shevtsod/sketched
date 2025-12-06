import { Connection } from './connection.type';
import { CursorType, decodeCursor, encodeCursor } from './cursor.util';
import { Edge } from './edge.type';
import { PageInfo } from './page-info';
import { PaginationArgsError } from './pagination-args.error';
import { PaginationArgs } from './pagination.args';

/** Default limit for pagination */
export const PAGINATE_LIMIT_DEFAULT = 10;
/** Maximum limit for pagination */
export const PAGINATE_LIMIT_MAX = 100;

/**
 * Pagination direction
 */
export enum Direction {
  ASC,
  DESC,
}

/**
 * Function that returns the decoded cursor value for a given record
 *
 * @param item to retrieve decoded cursor value for
 * @returns decoded cursor value
 */
export type CursorFunc<T, C extends CursorType> = (item: T) => C;

/**
 * Function that fetches a page of records for the given parameters
 *
 * @param limit number of records to fetch
 * @param cursor before/after cursor of previous/next record
 * @param direction first/last pagination direction
 * @return [records for this page, total number of records]
 */
export type FetchFunc<T, C extends CursorType> = (
  limit: number,
  direction: Direction,
  cursor?: C,
) => [T[], number] | Promise<[T[], number]>;

/**
 * Returns a Relay-style Connection object representing a page of records
 * and pagination metadata for cursor-based pagination
 *
 * @param pagination pagination arguments (direction and cursor)
 * @param cursorFunc callback to retrieve the cursor for a given record
 * @param fetchFunc callback to retrieve records for the current page and total number of records
 * @returns Connection of records and pagination metadata for this page
 */
export async function paginate<T, C extends CursorType>(
  pagination: PaginationArgs,
  cursorFunc: CursorFunc<T, C>,
  fetchFunc: FetchFunc<T, C>,
): Promise<Connection<T>> {
  const { first, after, last, before } = pagination;

  if (first && last) {
    throw new PaginationArgsError(
      'Only one of "first" or "last" directions must be provided',
    );
  }

  if (before && after) {
    throw new PaginationArgsError(
      'Only one of "before" or "after" cursors must be provided',
    );
  }

  const direction: Direction = last ? Direction.DESC : Direction.ASC;
  const cursor = direction === Direction.ASC ? after : before;
  const limit =
    (direction === Direction.ASC ? first : last) ?? PAGINATE_LIMIT_DEFAULT;

  if (direction === Direction.ASC && before) {
    throw new PaginationArgsError(
      '"before" cursor can only be used with "last" direction',
    );
  }

  if (direction === Direction.DESC && after) {
    throw new PaginationArgsError(
      '"after" cursor can only be used with "first" direction',
    );
  }

  if (limit > PAGINATE_LIMIT_MAX) {
    throw new PaginationArgsError(
      `Number of records queried must be below ${PAGINATE_LIMIT_MAX}`,
    );
  }

  const [rows, totalCount] = await fetchFunc(
    // Fetch n + 1 rows to detect if another page exists
    limit + 1,
    direction,
    decodeCursor(cursor) as C,
  );

  const hasExtraRow = rows.length > limit;
  const items = hasExtraRow
    ? direction === Direction.ASC
      ? rows.slice(0, limit)
      : rows.slice(1)
    : rows;

  const edges: Edge<T>[] = items.map((node) => ({
    node,
    cursor: encodeCursor(cursorFunc(node)),
  }));

  const pageInfo: PageInfo = {
    startCursor: edges[0]?.cursor ?? null,
    endCursor: edges[edges.length - 1]?.cursor ?? null,
    hasPreviousPage:
      direction === Direction.DESC ? hasExtraRow : !!cursor && edges.length > 0,
    hasNextPage:
      direction === Direction.ASC ? hasExtraRow : !!cursor && edges.length > 0,
  };

  return { edges, pageInfo, totalCount };
}
