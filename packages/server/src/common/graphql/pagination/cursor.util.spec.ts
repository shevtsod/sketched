import { decodeCursor, encodeCursor } from './cursor.util';

const values = [
  {
    encoded: 'eyJjdXJzb3IiOiJ0ZXN0In0=',
    decoded: 'test',
  },
  {
    encoded: 'eyJjdXJzb3IiOjF9',
    decoded: 1,
  },
  {
    encoded: 'eyJjdXJzb3IiOiIxOTcwLTAxLTAxVDAwOjAwOjAwLjAwMFoifQ==',
    decoded: new Date(0),
  },
];

describe('cursor.util', () => {
  it('should encode a cursor', () => {
    for (const { encoded, decoded } of values) {
      expect(encodeCursor(decoded)).toEqual(encoded);
    }
  });

  it('should decode a cursor', () => {
    expect(decodeCursor(undefined)).toBeUndefined();

    for (const { encoded, decoded } of values) {
      expect(decodeCursor(encoded)).toEqual(decoded);
    }
  });
});
