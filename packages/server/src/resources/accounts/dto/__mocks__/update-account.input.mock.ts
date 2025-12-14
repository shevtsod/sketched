import { mockAccount } from '../../entities/__mocks__/account.entity.mock';
import { UpdateAccountInput } from '../update-account.input';

export function mockUpdateAccountInput(
  overrides?: Partial<UpdateAccountInput>,
): UpdateAccountInput {
  const { createdAt, updatedAt, ...account } = mockAccount();
  return { ...account, ...overrides };
}
