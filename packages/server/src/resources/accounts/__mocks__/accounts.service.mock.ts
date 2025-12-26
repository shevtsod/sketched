import { paginate } from '../../../common/graphql/pagination/pagination.util';
import { createMockAccount } from '../entities/__mocks__/account.entity.mock';
import { Account } from '../entities/account.entity';

export async function createMockAccountsService() {
  const mocks = await Promise.all(
    Array.from({ length: 10 }, createMockAccount),
  );

  return {
    create: vi.fn((_opts) => mocks),
    findOne: vi.fn<(_opts) => Account | undefined>(() => mocks[0]),
    findUnique: vi.fn<(_opts) => Account | undefined>(() => mocks[0]),
    findMany: vi.fn((_opts) => mocks),
    paginate: vi.fn((opts) =>
      paginate(
        opts,
        (mock) => mock.id,
        () => [mocks, mocks.length],
        { transformClass: Account },
      ),
    ),
    update: vi.fn((_opts) => mocks),
    delete: vi.fn((_opts) => mocks),
    count: vi.fn((_opts) => mocks.length),
  };
}
