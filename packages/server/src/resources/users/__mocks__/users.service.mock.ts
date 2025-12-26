import { paginate } from '../../../common/graphql/pagination/pagination.util';
import { createMockUser } from '../entities/__mocks__/user.entity.mock';
import { User } from '../entities/user.entity';

export async function createMockUsersService() {
  const mocks = await Promise.all(Array.from({ length: 10 }, createMockUser));

  return {
    create: vi.fn((_opts) => mocks),
    findOne: vi.fn<(_opts) => User | undefined>(() => mocks[0]),
    findUnique: vi.fn<(_opts) => User | undefined>(() => mocks[0]),
    findMany: vi.fn((_opts) => mocks),
    paginate: vi.fn((opts) =>
      paginate(
        opts,
        (mock) => mock.id,
        () => [mocks, mocks.length],
        { transformClass: User },
      ),
    ),
    update: vi.fn((_opts) => mocks),
    delete: vi.fn((_opts) => mocks),
    count: vi.fn((_opts) => mocks.length),
  };
}
