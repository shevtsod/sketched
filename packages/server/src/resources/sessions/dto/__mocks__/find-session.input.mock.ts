import { createMockSession } from '../../entities/__mocks__/session.entity.mock';
import { FindSessionInput } from '../find-session.input';

export async function createMockFindSessionInput(
  overrides?: Partial<FindSessionInput>,
): Promise<FindSessionInput> {
  const { id } = await createMockSession();
  return { id, ...overrides };
}
