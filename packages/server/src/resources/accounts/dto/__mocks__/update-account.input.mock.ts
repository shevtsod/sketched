import { createMockAccount } from '../../entities/__mocks__/account.entity.mock';
import { UpdateAccountInput } from '../update-account.input';

export async function createMockUpdateAccountInput(
  overrides?: Partial<UpdateAccountInput>,
): Promise<UpdateAccountInput> {
  const { createdAt, updatedAt, ...account } = await createMockAccount();
  return { ...account, ...overrides };
}
