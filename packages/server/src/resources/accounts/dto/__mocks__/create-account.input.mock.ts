import { CreateAccountInput } from '../create-account.input';
import { createMockUpdateAccountInput } from './update-account.input.mock';

export async function createMockCreateAccountInput(
  overrides?: Partial<CreateAccountInput>,
): Promise<CreateAccountInput> {
  const { id, ...account } = await createMockUpdateAccountInput();
  return { ...account, ...overrides };
}
