import { paginate } from '../../../common/graphql/pagination/pagination.util';
import { mockUser } from '../entities/__mocks__/user.entity.mock';
import { User } from '../entities/user.entity';

export function createMockUsersService() {
  const mocks = Array.from({ length: 10 }, mockUser);

  return {
    create: vi.fn(() => mocks),
    findOne: vi.fn(() => mocks[0]),
    findMany: vi.fn(() => mocks),
    paginate: vi.fn((paginationArgs) =>
      paginate(
        paginationArgs,
        (mock) => mock.id,
        () => [mocks, mocks.length],
        { transformClass: User },
      ),
    ),
    update: vi.fn(() => mocks),
    delete: vi.fn(() => mocks),
    count: vi.fn(() => mocks.length),
  };
}
