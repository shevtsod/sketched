import { createMockSession } from '../../entities/__mocks__/session.entity.mock';
import { FindSessionsInput } from '../find-sessions.input';

export async function createMockFindSessionsInput(
  overrides?: Partial<FindSessionsInput>,
): Promise<FindSessionsInput> {
  const account = await createMockSession();
  return { ...account, ...overrides };
}
