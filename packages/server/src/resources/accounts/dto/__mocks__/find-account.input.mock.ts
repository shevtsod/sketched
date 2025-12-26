import { createMockAccount } from '../../entities/__mocks__/account.entity.mock';
import { FindAccountInput } from '../find-account.input';

export async function createMockFindAccountInput(
  overrides?: Partial<FindAccountInput>,
): Promise<FindAccountInput> {
  const { id } = await createMockAccount();
  return { id, ...overrides };
}
