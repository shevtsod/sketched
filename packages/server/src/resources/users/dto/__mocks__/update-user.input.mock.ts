import { mockUser } from '../../entities/__mocks__/user.entity.mock';
import { UpdateUserInput } from '../update-user.input';

export function mockUpdateUserInput(
  overrides?: Partial<UpdateUserInput>,
): UpdateUserInput {
  const { createdAt, updatedAt, ...user } = mockUser();
  return { ...user, ...overrides };
}
