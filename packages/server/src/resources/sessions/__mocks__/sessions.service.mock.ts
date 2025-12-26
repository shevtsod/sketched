import { paginate } from '../../../common/graphql/pagination/pagination.util';
import { createMockSession } from '../entities/__mocks__/session.entity.mock';
import { Session } from '../entities/session.entity';

export async function createMockSessionsService() {
  const mocks = await Promise.all(
    Array.from({ length: 10 }, createMockSession),
  );

  return {
    create: vi.fn(() => mocks),
    findOne: vi.fn(() => mocks[0]),
    findUnique: vi.fn(() => mocks[0]),
    findMany: vi.fn(() => mocks),
    paginate: vi.fn((paginationArgs) =>
      paginate(
        paginationArgs,
        (mock) => mock.id,
        () => [mocks, mocks.length],
        { transformClass: Session },
      ),
    ),
    update: vi.fn(() => mocks),
    delete: vi.fn(() => mocks),
    count: vi.fn(() => mocks.length),
  };
}
