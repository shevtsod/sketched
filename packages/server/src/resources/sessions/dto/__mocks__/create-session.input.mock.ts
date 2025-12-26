import { CreateSessionInput } from '../create-session.input';
import { createMockUpdateSessionInput } from './update-session.input.mock';

export async function createMockCreateSessionInput(
  overrides?: Partial<CreateSessionInput>,
): Promise<CreateSessionInput> {
  const { id, ...account } = await createMockUpdateSessionInput();
  return { ...account, ...overrides };
}
