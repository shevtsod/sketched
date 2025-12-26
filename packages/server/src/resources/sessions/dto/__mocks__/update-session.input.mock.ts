import { createMockSession } from '../../entities/__mocks__/session.entity.mock';
import { UpdateSessionInput } from '../update-session.input';

export async function createMockUpdateSessionInput(
  overrides?: Partial<UpdateSessionInput>,
): Promise<UpdateSessionInput> {
  const { createdAt, updatedAt, ...account } = await createMockSession();
  return { ...account, ...overrides };
}
