import { createMockUser } from '../../entities/__mocks__/user.entity.mock';
import { FindUserInput } from '../find-user.input';

export async function createMockFindUserInput(
  overrides?: Partial<FindUserInput>,
): Promise<FindUserInput> {
  const { id } = await createMockUser();
  return { id, ...overrides };
}
