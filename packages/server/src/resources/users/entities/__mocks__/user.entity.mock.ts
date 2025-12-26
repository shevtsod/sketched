import { faker } from '@faker-js/faker';
import { User } from '../user.entity';

export async function createMockUser(overrides?: Partial<User>): Promise<User> {
  return {
    id: faker.number.int(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    image: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  };
}
