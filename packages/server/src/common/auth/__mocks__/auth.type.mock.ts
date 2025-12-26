import { faker } from '@faker-js/faker';
import { AccessToken, ExpressUser, JwtPayload } from '../auth.type';

export function createMockExpressUser(
  overrides?: Partial<ExpressUser>,
): ExpressUser {
  return {
    id: faker.number.int(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    ...overrides,
  };
}

export function createMockJwtPayload(
  overrides?: Partial<JwtPayload>,
): JwtPayload {
  return {
    iat: Math.floor(faker.date.future().getTime() / 1000),
    exp: Math.floor(faker.date.future().getTime() / 1000),
    ...overrides,
  };
}

export function createMockAccessToken(
  overrides?: Partial<AccessToken>,
): AccessToken {
  return {
    access_token: faker.string.alphanumeric({ length: 10 }),
    token_type: faker.string.alphanumeric({ length: 10 }),
    refresh_token: faker.string.alphanumeric({ length: 10 }),
    scope: faker.string.alphanumeric({ length: 10 }),
    expires_in: faker.number.int({ min: 1 }),
    ...overrides,
  };
}
