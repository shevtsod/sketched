import type { Mock } from 'vitest';

export interface CreateMockPrismaServiceOptions {
  number?: number;
}

interface MockedModelDelegate<T> {
  createManyAndReturn: Mock<(_input: any) => T[]>;
  findFirst: Mock<(_input: any) => T>;
  findUnique: Mock<(_input: any) => T>;
  findMany: Mock<(_input: any) => T[]>;
  updateManyAndReturn: Mock<(_input: any) => T[]>;
  upsert: Mock<(_input: any) => T>;
  deleteMany: Mock<(_input: any) => void>;
  count: Mock<(_input: any) => number>;
}

type MockPrismaService<TModel extends string, T> = {
  $transaction: Mock<(queries: any) => any>;
  $executeRawUnsafe: Mock;
} & {
  [K in TModel]?: MockedModelDelegate<T>;
};

export async function createMockPrismaService<TModel extends string, T>(
  model?: string,
  mockFn?: () => T | Promise<T>,
  opts?: CreateMockPrismaServiceOptions,
): Promise<MockPrismaService<TModel, T>> {
  const { number = 10 } = opts ?? {};

  const mockService = {
    $transaction: vi.fn((queries) => Promise.all(queries)),
    $executeRawUnsafe: vi.fn(),
  };

  if (model !== undefined && mockFn !== undefined) {
    const mocks = await Promise.all(Array.from({ length: number }, mockFn));

    mockService[model] = {
      createManyAndReturn: vi.fn(() => mocks),
      findFirst: vi.fn(() => mockFn()),
      findUnique: vi.fn(() => mockFn()),
      findMany: vi.fn(() => mocks),
      updateManyAndReturn: vi.fn(() => mocks),
      upsert: vi.fn(() => mocks[0]),
      deleteMany: vi.fn(),
      count: vi.fn(() => mocks.length),
    };
  }

  return mockService as MockPrismaService<TModel, T>;
}
