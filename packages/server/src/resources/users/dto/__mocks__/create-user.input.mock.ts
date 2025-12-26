import { CreateUserInput } from '../create-user.input';
import { createMockUpdateUserInput } from './update-user.input.mock';

export async function createMockCreateUserInput(
  overrides?: Partial<CreateUserInput>,
): Promise<CreateUserInput> {
  const { id, ...user } = await createMockUpdateUserInput();
  return { ...user, ...overrides };
}
