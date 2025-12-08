import { faker } from '@faker-js/faker';
import { User } from '../user.entity';

export function mockUser(overrides?: Partial<User>): User {
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
