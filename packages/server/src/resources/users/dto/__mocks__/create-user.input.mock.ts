import { CreateUserInput } from '../create-user.input';
import { mockUpdateUserInput } from './update-user.input.mock';

export function mockCreateUserInput(
  overrides?: Partial<CreateUserInput>,
): CreateUserInput {
  const { id, ...user } = mockUpdateUserInput();
  return { ...user, ...overrides };
}
