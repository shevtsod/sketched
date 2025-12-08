import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { eq, SQL } from 'drizzle-orm';
import { Mocked } from 'vitest';
import { users } from '../../common/db/schema';
import { mockPaginationArgs } from '../../common/graphql/pagination/__mocks__/pagination.args.mock';
import {
  CursorFunc,
  Direction,
  FetchFunc,
  paginate,
} from '../../common/graphql/pagination/pagination.util';
import { mockUsersService } from './__mocks__/users.service.mock';
import { mockCreateUserInput } from './dto/__mocks__/create-user.input.mock';
import { mockFindUserInput } from './dto/__mocks__/find-user.input.mock';
import { mockFindUsersInput } from './dto/__mocks__/find-users.input.mock';
import { mockUpdateUserInput } from './dto/__mocks__/update-user.input.mock';
import { mockUser } from './entities/__mocks__/user.entity.mock';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

vi.mock(
  '../../common/graphql/pagination/pagination.util.js',
  async (importOriginal) => {
    const originalExports: unknown[] = await importOriginal();

    return {
      ...originalExports,
      paginate: vi.fn(
        (
          _pagination,
          cursorFunc: CursorFunc<User, number>,
          fetchFunc: FetchFunc<User, number>,
        ) => {
          const user = mockUser();
          cursorFunc(user);
          fetchFunc(faker.number.int(), Direction.ASC, user.id);
        },
      ),
    };
  },
);

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: Mocked<UsersService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    resolver = module.get(UsersResolver);
    usersService = module.get<Mocked<UsersService>>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create a User', async () => {
    const input = mockCreateUserInput();
    await resolver.createUser(input);
    expect(usersService.create).toHaveBeenCalledWith(input);
  });

  it('should find one User', async () => {
    const input = mockFindUserInput();
    await resolver.user(input);
    const options = { where: eq(users.id, input.id) };
    expect(usersService.findOne).toHaveBeenCalledWith(options);
  });

  it('should find many Users', async () => {
    const pagination = mockPaginationArgs();
    const input = mockFindUsersInput();
    await resolver.users(pagination, input);

    expect(paginate).toHaveBeenCalledWith(
      pagination,
      expect.any(Function),
      expect.any(Function),
    );
    expect(usersService.findManyWithCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.any(SQL),
        limit: expect.any(Number),
        orderBy: expect.any(SQL),
      }),
      expect.objectContaining({
        where: expect.any(SQL),
      }),
    );
  });

  it('should update a User', async () => {
    const { id, ...input } = mockUpdateUserInput();
    const where = eq(users.id, id);
    await resolver.updateUser({ id, ...input });
    expect(usersService.update).toHaveBeenCalledWith(where, input);
  });

  it('should delete a User', async () => {
    const input = mockFindUserInput();
    const where = eq(users.id, input.id);
    await resolver.deleteUser(input);
    expect(usersService.delete).toHaveBeenCalledWith(where);
  });
});
