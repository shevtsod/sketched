import { mockUser } from '../../entities/__mocks__/user.entity.mock';
import { CreateUserInput } from '../create-user.input';

export function mockCreateUserInput(
  overrides?: Partial<CreateUserInput>,
): CreateUserInput {
  const user = mockUser();

  return {
    email: user.email,
    name: user.name,
    image: user.image ?? undefined,
    ...overrides,
  };
}
