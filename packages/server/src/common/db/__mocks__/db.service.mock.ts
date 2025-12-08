export interface MockDbServiceOptions {
  /** Number of mock records to create */
  length?: number;
}

export const createMockDbService = <T>(
  mock: () => T,
  options?: MockDbServiceOptions,
) => {
  const { length = 10 } = options ?? {};
  const records = Array.from({ length }, mock);

  return {
    create: vi.fn(() => records[0]),
    findOne: vi.fn(() => records[0]),
    findMany: vi.fn(() => records),
    findManyWithCount: vi.fn(() => [records, records.length]),
    update: vi.fn(() => records),
    delete: vi.fn(() => records),
    count: vi.fn(() => records.length),
  };
};
