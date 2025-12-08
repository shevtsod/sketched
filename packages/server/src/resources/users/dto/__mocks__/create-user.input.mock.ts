import { faker } from '@faker-js/faker';
import { CreateUserInput } from '../create-user.input';

export function mockCreateUserInput(
  overrides?: Partial<CreateUserInput>,
): CreateUserInput {
  return {
    email: faker.internet.email(),
    name: faker.internet.username(),
    image: faker.internet.url(),
    ...overrides,
  };
}
