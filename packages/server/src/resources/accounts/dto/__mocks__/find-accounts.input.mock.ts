import { createMockAccount } from '../../entities/__mocks__/account.entity.mock';
import { FindAccountsInput } from '../find-accounts.input';

export async function createMockFindAccountsInput(
  overrides?: Partial<FindAccountsInput>,
): Promise<FindAccountsInput> {
  const account = await createMockAccount();
  return { ...account, ...overrides };
}
