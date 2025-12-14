import { paginate } from '../../../common/graphql/pagination/pagination.util';
import { mockAccount } from '../entities/__mocks__/account.entity.mock';
import { Account } from '../entities/account.entity';

export function createMockAccountsService() {
  const mocks = Array.from({ length: 10 }, mockAccount);

  return {
    create: vi.fn(() => mocks),
    findOne: vi.fn(() => mocks[0]),
    findMany: vi.fn(() => mocks),
    paginate: vi.fn((paginationArgs) =>
      paginate(
        paginationArgs,
        (mock) => mock.id,
        () => [mocks, mocks.length],
        { transformClass: Account },
      ),
    ),
    update: vi.fn(() => mocks),
    delete: vi.fn(() => mocks),
    count: vi.fn(() => mocks.length),
  };
}
