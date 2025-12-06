export type CursorType = string | number | Date;

/**
 * Encodes a unique identifier for an entity to a cursor
 *
 * @param cursor unique identifier
 * @returns encoded cursor
 */
export function encodeCursor(cursor: CursorType): string {
  const payload = JSON.stringify({ cursor });
  return Buffer.from(payload).toString('base64');
}

/**
 * Decodes a cursor into the unique identifier of an entity
 *
 * @param value encoded cursor
 * @returns decoded unique identifier
 */
export function decodeCursor(value?: string): CursorType | undefined {
  if (value === undefined) return undefined;

  const decoded = Buffer.from(value, 'base64').toString('utf8');
  const { cursor } = JSON.parse(decoded);

  // try to parse as date
  if (typeof cursor === 'string' && !isNaN(Date.parse(cursor))) {
    return new Date(cursor);
  }

  return cursor;
}
