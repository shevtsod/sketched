import { CreateAccountInput } from '../create-account.input';
import { mockUpdateAccountInput } from './update-account.input.mock';

export function mockCreateAccountInput(
  overrides?: Partial<CreateAccountInput>,
): CreateAccountInput {
  const { id, ...account } = mockUpdateAccountInput();
  return { ...account, ...overrides };
}
