import { mockUser } from '../../entities/__mocks__/user.entity.mock';
import { FindUserInput } from '../find-user.input';

export function mockFindUserInput(
  overrides?: Partial<FindUserInput>,
): FindUserInput {
  const user = mockUser();

  return {
    id: user.id,
    ...overrides,
  };
}
