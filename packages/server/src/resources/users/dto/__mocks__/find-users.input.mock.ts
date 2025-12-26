import { createMockPaginationArgs } from '../../../../common/graphql/pagination/__mocks__/pagination.args.mock';
import { createMockUser } from '../../entities/__mocks__/user.entity.mock';
import { FindUsersInput } from '../find-users.input';

export async function createMockFindUsersInput(
  overrides?: Partial<FindUsersInput>,
): Promise<FindUsersInput> {
  const paginationArgs = createMockPaginationArgs();
  const user = createMockUser();
  return { ...paginationArgs, ...user, ...overrides };
}
