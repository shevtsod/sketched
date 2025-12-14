import type { Mock } from 'vitest';

export interface CreateMockPrismaServiceOptions {
  number?: number;
}

interface MockedModelDelegate<T> {
  createManyAndReturn: Mock<() => T[]>;
  findFirst: Mock<() => T>;
  findMany: Mock<() => T[]>;
  updateManyAndReturn: Mock<() => T[]>;
  deleteMany: Mock<() => void>;
  count: Mock<() => number>;
}

type MockPrismaService<TModel extends string, T> = {
  $transaction: Mock<(queries: any) => any>;
  $executeRawUnsafe: Mock;
} & {
  [K in TModel]?: MockedModelDelegate<T>;
};

export function createMockPrismaService<TModel extends string, T>(
  model?: string,
  mockFn?: () => T,
  opts?: CreateMockPrismaServiceOptions,
): MockPrismaService<TModel, T> {
  const { number = 10 } = opts ?? {};

  const mockService = {
    $transaction: vi.fn((queries) => Promise.all(queries)),
    $executeRawUnsafe: vi.fn(),
  };

  if (model !== undefined && mockFn !== undefined) {
    const mocks = Array.from({ length: number }, mockFn);

    mockService[model] = {
      createManyAndReturn: vi.fn(() => mocks),
      findFirst: vi.fn(() => mockFn()),
      findMany: vi.fn(() => mocks),
      updateManyAndReturn: vi.fn(() => mocks),
      deleteMany: vi.fn(),
      count: vi.fn(() => mocks.length),
    };
  }

  return mockService as MockPrismaService<TModel, T>;
}
