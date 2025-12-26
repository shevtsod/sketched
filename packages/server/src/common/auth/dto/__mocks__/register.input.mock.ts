import { faker } from '@faker-js/faker';
import { createMockCreateUserInput } from '../../../../resources/users/dto/__mocks__/create-user.input.mock';
import { RegisterInput } from '../register.input';

export async function createMockRegisterInput(
  overrides?: Partial<RegisterInput>,
): Promise<RegisterInput> {
  const createUserInput = await createMockCreateUserInput();

  return {
    ...createUserInput,
    password: faker.internet.password(),
    ...overrides,
  };
}
