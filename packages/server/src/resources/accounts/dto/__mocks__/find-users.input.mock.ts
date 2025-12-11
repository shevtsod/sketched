import { mockUser } from '../../entities/__mocks__/user.entity.mock';
import { FindUsersInput } from '../find-users.input';

export function mockFindUsersInput(
  overrides?: Partial<FindUsersInput>,
): FindUsersInput {
  const user = mockUser();

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image ?? undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt ?? undefined,
    ...overrides,
  };
}
