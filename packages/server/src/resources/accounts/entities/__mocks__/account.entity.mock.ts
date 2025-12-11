import { faker } from '@faker-js/faker';
import { Account } from '../account.entity';

export function mockAccount(overrides?: Partial<Account>): Account {
  return {
    id: faker.number.int(),
    userId: faker.number.int(),
    providerId: faker.string.uuid(),
    accountId: faker.string.uuid(),
    accessToken: faker.string.uuid(),
    refreshToken: faker.string.uuid(),
    accessTokenExpiresAt: faker.date.future(),
    refreshTokenExpiresAt: faker.date.future(),
    scope: faker.string.alpha(10),
    idToken: faker.string.uuid(),
    password: faker.internet.password(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  };
}
