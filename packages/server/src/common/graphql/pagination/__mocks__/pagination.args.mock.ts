import { faker } from '@faker-js/faker';
import { encodeCursor } from '../cursor.util';
import { PaginationArgs } from '../pagination.args';
import { PAGINATE_LIMIT_MAX } from '../pagination.util';

export function createMockPaginationArgs(
  overrides?: Partial<PaginationArgs>,
): PaginationArgs {
  return {
    first: faker.number.int({ min: 1, max: PAGINATE_LIMIT_MAX }),
    after: encodeCursor(faker.string.uuid()),
    ...overrides,
  };
}
