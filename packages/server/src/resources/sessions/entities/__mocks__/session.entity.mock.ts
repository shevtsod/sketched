import { faker } from '@faker-js/faker';
import { Session } from '../session.entity';

export async function createMockSession(
  overrides?: Partial<Session>,
): Promise<Session> {
  return {
    id: faker.number.int(),
    userId: faker.number.int(),
    token: faker.internet.password(),
    expiresAt: faker.date.future(),
    ipAddress: faker.internet.ip(),
    userAgent: faker.internet.userAgent(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  };
}
