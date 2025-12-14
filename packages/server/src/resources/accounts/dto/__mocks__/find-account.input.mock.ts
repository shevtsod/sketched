import { mockAccount } from '../../entities/__mocks__/account.entity.mock';
import { FindAccountInput } from '../find-account.input';

export function mockFindAccountInput(
  overrides?: Partial<FindAccountInput>,
): FindAccountInput {
  const { id } = mockAccount();
  return { id, ...overrides };
}
