/**
 * Encodes a unique identifier for an entity to a cursor
 *
 * @param value unique identifier
 * @returns encoded cursor
 */
export function encodeCursor(value: string | number | Date): string {
  return Buffer.from(String(value)).toString('base64');
}

/**
 * Decodes a cursor into the unique identifier of an entity
 *
 * @param cursor encoded cursor
 * @returns decoded unique identifier
 */
export function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, 'base64').toString('utf8');
}
