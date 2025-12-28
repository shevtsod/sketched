import { createMockUser } from '../../entities/__mocks__/user.entity.mock';
import { UpdateUserInput } from '../update-user.input';

export async function createMockUpdateUserInput(
  overrides?: Partial<UpdateUserInput>,
): Promise<UpdateUserInput> {
  const { image, createdAt, updatedAt, ...user } = await createMockUser();
  return { ...user, ...overrides };
}
