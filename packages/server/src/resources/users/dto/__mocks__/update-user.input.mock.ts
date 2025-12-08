import { faker } from '@faker-js/faker';
import { UpdateUserInput } from '../update-user.input';

export function mockUpdateUserInput(
  overrides?: Partial<UpdateUserInput>,
): UpdateUserInput {
  return {
    id: faker.number.int(),
    email: faker.internet.email(),
    name: faker.internet.username(),
    image: faker.internet.url(),
    ...overrides,
  };
}
