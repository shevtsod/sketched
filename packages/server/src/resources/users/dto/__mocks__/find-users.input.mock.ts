import { mockUser } from '../../entities/__mocks__/user.entity.mock';
import { FindUsersInput } from '../find-users.input';

export function mockFindUsersInput(
  overrides?: Partial<FindUsersInput>,
): FindUsersInput {
  const user = mockUser();
  return { ...user, ...overrides };
}
