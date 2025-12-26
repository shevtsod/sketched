import { createMockPaginationArgs } from '../../../../common/graphql/pagination/__mocks__/pagination.args.mock';
import { createMockSession } from '../../entities/__mocks__/session.entity.mock';
import { FindSessionsInput } from '../find-sessions.input';

export async function createMockFindSessionsInput(
  overrides?: Partial<FindSessionsInput>,
): Promise<FindSessionsInput> {
  const paginationArgs = createMockPaginationArgs();
  const account = await createMockSession();
  return { ...paginationArgs, ...account, ...overrides };
}
