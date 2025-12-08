import { createMockDbService } from '../../../common/db/__mocks__/db.service.mock';
import { mockUser } from '../entities/__mocks__/user.entity.mock';

const mockUsersDbService = createMockDbService(mockUser);

export const mockUsersService = {
  create: vi.fn(() => mockUsersDbService.create),
  findOne: vi.fn(() => mockUsersDbService.findOne),
  findMany: vi.fn(() => mockUsersDbService.findMany),
  findManyWithCount: vi.fn(() => mockUsersDbService.findManyWithCount),
  update: vi.fn(() => mockUsersDbService.update),
  delete: vi.fn(() => mockUsersDbService.delete),
  count: vi.fn(() => mockUsersDbService.count),
};
