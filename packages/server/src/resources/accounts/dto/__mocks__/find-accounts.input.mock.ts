import { createMockPaginationArgs } from '../../../../common/graphql/pagination/__mocks__/pagination.args.mock';
import { createMockAccount } from '../../entities/__mocks__/account.entity.mock';
import { FindAccountsInput } from '../find-accounts.input';

export async function createMockFindAccountsInput(
  overrides?: Partial<FindAccountsInput>,
): Promise<FindAccountsInput> {
  const paginationArgs = createMockPaginationArgs();
  const account = await createMockAccount();
  return { ...paginationArgs, ...account, ...overrides };
}
