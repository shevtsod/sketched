import { mockAccount } from '../../entities/__mocks__/account.entity.mock';
import { FindAccountsInput } from '../find-accounts.input';

export function mockFindAccountsInput(
  overrides?: Partial<FindAccountsInput>,
): FindAccountsInput {
  const account = mockAccount();
  return { ...account, ...overrides };
}
