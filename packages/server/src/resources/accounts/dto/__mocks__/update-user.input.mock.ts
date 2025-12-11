import { mockUser } from '../../entities/__mocks__/user.entity.mock';
import { UpdateUserInput } from '../update-user.input';

export function mockUpdateUserInput(
  overrides?: Partial<UpdateUserInput>,
): UpdateUserInput {
  const user = mockUser();

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image ?? undefined,
    ...overrides,
  };
}
