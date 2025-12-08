import { faker } from '@faker-js/faker';
import { FindUserInput } from '../find-user.input';

export function mockFindUserInput(
  overrides?: Partial<FindUserInput>,
): FindUserInput {
  return {
    id: faker.number.int(),
    ...overrides,
  };
}
