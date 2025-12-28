import { createMockUser } from '../../entities/__mocks__/user.entity.mock';
import { FindUsersInput } from '../find-users.input';

export async function createMockFindUsersInput(
  overrides?: Partial<FindUsersInput>,
): Promise<FindUsersInput> {
  const user = await createMockUser();
  return { ...user, ...overrides };
}
