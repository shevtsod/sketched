import { faker } from '@faker-js/faker';
import { generate } from 'generate-password';
import { Session } from '../session.entity';

export async function createMockSession(
  overrides?: Partial<Session>,
): Promise<Session> {
  return {
    id: faker.number.int({ min: 1, max: 2147483647 }),
    userId: faker.number.int(),
    token: generate({
      length: 16,
      numbers: true,
      symbols: true,
      strict: true,
    }),
    expiresAt: faker.date.future(),
    ipAddress: faker.internet.ip(),
    userAgent: faker.internet.userAgent(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  };
}
