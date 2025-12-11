import { mockUser } from '../../entities/__mocks__/user.entity.mock';
import { CreateAccountInput } from '../create-account.input';

export function mockCreateUserInput(
  overrides?: Partial<CreateAccountInput>,
): CreateAccountInput {
  const user = mockUser();

  return {
    email: user.email,
    name: user.name,
    image: user.image ?? undefined,
    ...overrides,
  };
}
