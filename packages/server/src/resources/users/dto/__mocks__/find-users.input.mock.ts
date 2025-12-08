import { faker } from '@faker-js/faker';
import { FindUsersInput } from '../find-users.input';

export function mockFindUsersInput(
  overrides?: Partial<FindUsersInput>,
): FindUsersInput {
  return {
    id: faker.number.int(),
    email: faker.internet.email(),
    name: faker.internet.username(),
    image: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  };
}
