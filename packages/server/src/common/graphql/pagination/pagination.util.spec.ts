import { Connection } from './connection.type';
import { encodeCursor } from './cursor.util';
import { PaginationArgsError } from './pagination-args.error';
import { PaginationArgs } from './pagination.args';
import {
  CursorFunc,
  Direction,
  FetchFunc,
  paginate,
  PAGINATE_LIMIT_DEFAULT,
  PAGINATE_LIMIT_MAX,
} from './pagination.util';

// [0, 1, 2, 3, ..., PAGINATE_LIMIT_MAX]
const data = Array.from({ length: PAGINATE_LIMIT_MAX + 1 }, (_, i) => i);

const cursorData: CursorFunc<(typeof data)[number], (typeof data)[number]> = (
  item,
) => item;

const fetchData: FetchFunc<(typeof data)[number], (typeof data)[number]> = (
  limit,
  direction,
  cursor,
) => {
  let start: number, end: number;

  if (direction === Direction.ASC) {
    start = cursor !== undefined ? cursor + 1 : 0;
    end = start + limit;
  } else {
    end = cursor !== undefined ? cursor : data.length;
    start = Math.max(0, end - limit);
  }

  const rows = data.slice(start, end);
  return [rows, data.length];
};

const paginateData = (pagination: PaginationArgs) =>
  paginate(pagination, cursorData, fetchData);

describe('pagination.util', () => {
  it('paginates forwards', async () => {
    const res = await paginateData({});
    const expected = data.slice(0, PAGINATE_LIMIT_DEFAULT);

    expect(res).toEqual({
      edges: expected.map((node) => ({ cursor: encodeCursor(node), node })),
      pageInfo: {
        startCursor: encodeCursor(expected[0]),
        endCursor: encodeCursor(expected[expected.length - 1]),
        hasPreviousPage: false,
        hasNextPage: true,
      },
      totalCount: data.length,
    } as Connection<(typeof data)[number]>);
  });

  it('paginates forwards with a cursor', async () => {
    const res = await paginateData({
      first: PAGINATE_LIMIT_MAX,
      after: encodeCursor(0),
    });
    const expected = data.slice(1, PAGINATE_LIMIT_MAX + 1);

    expect(res).toEqual({
      edges: expected.map((node) => ({ cursor: encodeCursor(node), node })),
      pageInfo: {
        startCursor: encodeCursor(expected[0]),
        endCursor: encodeCursor(expected[expected.length - 1]),
        hasPreviousPage: true,
        hasNextPage: false,
      },
      totalCount: data.length,
    } as Connection<(typeof data)[number]>);
  });

  it('paginates forwards with a cursor out of bounds', async () => {
    const res = await paginateData({
      first: PAGINATE_LIMIT_DEFAULT,
      after: encodeCursor(data.length - 1),
    });

    expect(res).toEqual({
      edges: [],
      pageInfo: {
        startCursor: null,
        endCursor: null,
        hasPreviousPage: false,
        hasNextPage: false,
      },
      totalCount: data.length,
    } as Connection<(typeof data)[number]>);
  });

  it('paginates backwards', async () => {
    const res = await paginateData({ last: PAGINATE_LIMIT_DEFAULT });
    const expected = data.slice(data.length - PAGINATE_LIMIT_DEFAULT);

    expect(res).toEqual({
      edges: expected.map((node) => ({ cursor: encodeCursor(node), node })),
      pageInfo: {
        startCursor: encodeCursor(expected[0]),
        endCursor: encodeCursor(expected[expected.length - 1]),
        hasPreviousPage: true,
        hasNextPage: false,
      },
      totalCount: data.length,
    } as Connection<(typeof data)[number]>);
  });

  it('paginates backwards with a cursor', async () => {
    const res = await paginateData({
      last: PAGINATE_LIMIT_MAX,
      before: encodeCursor(data.length - 1),
    });
    const expected = data.slice(
      data.length - PAGINATE_LIMIT_MAX - 1,
      data.length - 1,
    );

    expect(res).toEqual({
      edges: expected.map((node) => ({ cursor: encodeCursor(node), node })),
      pageInfo: {
        startCursor: encodeCursor(expected[0]),
        endCursor: encodeCursor(expected[expected.length - 1]),
        hasPreviousPage: false,
        hasNextPage: true,
      },
      totalCount: data.length,
    } as Connection<(typeof data)[number]>);
  });

  it('paginates backwards with a cursor out of bounds', async () => {
    const res = await paginateData({
      last: PAGINATE_LIMIT_DEFAULT,
      before: encodeCursor(0),
    });

    expect(res).toEqual({
      edges: [],
      pageInfo: {
        startCursor: null,
        endCursor: null,
        hasPreviousPage: false,
        hasNextPage: false,
      },
      totalCount: data.length,
    } as Connection<(typeof data)[number]>);
  });

  it('fails to paginate forwards and backwards at the same time', async () => {
    expect(
      paginateData({
        first: PAGINATE_LIMIT_DEFAULT,
        last: PAGINATE_LIMIT_DEFAULT,
      }),
    ).rejects.toThrow(PaginationArgsError);
  });

  it('fails to paginate with before and after cursors at the same time', async () => {
    expect(
      paginateData({ before: encodeCursor(0), after: encodeCursor(0) }),
    ).rejects.toThrow(PaginationArgsError);
  });

  it('fails to paginate with invalid direction and cursor combination', async () => {
    expect(paginateData({ before: encodeCursor(0) })).rejects.toThrow(
      PaginationArgsError,
    );

    expect(
      paginateData({ last: PAGINATE_LIMIT_DEFAULT, after: encodeCursor(0) }),
    ).rejects.toThrow(PaginationArgsError);
  });

  it('fails to paginate over limit', async () => {
    expect(paginateData({ first: PAGINATE_LIMIT_MAX + 1 })).rejects.toThrow(
      PaginationArgsError,
    );
  });
});
