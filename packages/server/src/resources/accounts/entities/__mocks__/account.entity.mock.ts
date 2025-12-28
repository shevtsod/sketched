import { faker } from '@faker-js/faker';
import { generate } from 'generate-password';
import { Account } from '../account.entity';
import { Providers } from '../provider.enum';

export async function createMockAccount(
  overrides?: Partial<Account>,
): Promise<Account> {
  return {
    id: faker.number.int({ min: 1, max: 2147483647 }),
    userId: faker.number.int(),
    providerId: Providers[Math.floor(Math.random() * Providers.length)],
    accountId: faker.string.alpha(10),
    accessToken: faker.string.uuid(),
    refreshToken: faker.string.uuid(),
    accessTokenExpiresAt: faker.date.future(),
    refreshTokenExpiresAt: faker.date.future(),
    scope: faker.string.alpha(10),
    idToken: faker.string.uuid(),
    password: generate({
      length: 16,
      numbers: true,
      symbols: true,
      strict: true,
    }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  };
}
