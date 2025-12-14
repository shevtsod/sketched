import { Test } from '@nestjs/testing';
import { Mocked } from 'vitest';
import { mockPaginationArgs } from '../../common/graphql/pagination/__mocks__/pagination.args.mock';
import { createMockAccountsService } from '../accounts/__mocks__/accounts.service.mock';
import { AccountsService } from '../accounts/accounts.service';
import { mockFindAccountsInput } from '../accounts/dto/__mocks__/find-accounts.input.mock';
import { Account } from '../accounts/entities/account.entity';
import { createMockUsersService } from './__mocks__/users.service.mock';
import { mockCreateUserInput } from './dto/__mocks__/create-user.input.mock';
import { mockFindUserInput } from './dto/__mocks__/find-user.input.mock';
import { mockFindUsersInput } from './dto/__mocks__/find-users.input.mock';
import { mockUpdateUserInput } from './dto/__mocks__/update-user.input.mock';
import { mockUser } from './entities/__mocks__/user.entity.mock';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

const mockUsersService = createMockUsersService();
const mockAccountsService = createMockAccountsService();

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: Mocked<UsersService>;
  let accountsService: Mocked<AccountsService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AccountsService,
          useValue: mockAccountsService,
        },
      ],
    }).compile();

    resolver = module.get(UsersResolver);
    usersService = module.get<Mocked<UsersService>>(UsersService);
    accountsService = module.get<Mocked<AccountsService>>(AccountsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create a User', async () => {
    const input = mockCreateUserInput();
    const options = { data: input };
    const res = await resolver.createUser(input);
    expect(usersService.create).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(User);
  });

  it('should find one User', async () => {
    const input = mockFindUserInput();
    const options = { where: input };
    const res = await resolver.user(input);
    expect(usersService.findOne).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(User);
  });

  it('should find many Users', async () => {
    const paginationArgs = mockPaginationArgs();
    const input = mockFindUsersInput();
    const options = { where: input };
    const res = await resolver.users(paginationArgs, input);
    expect(usersService.paginate).toHaveBeenCalledWith(
      paginationArgs,
      options,
      expect.anything(),
    );

    for (const { node } of res.edges) {
      expect(node).toBeInstanceOf(User);
    }
  });

  it('should update a User', async () => {
    const input = mockUpdateUserInput();
    const { id, ...data } = input;
    const res = await resolver.updateUser(input);
    expect(usersService.update).toHaveBeenCalledWith({
      where: { id },
      data,
    });
    expect(res).toBeInstanceOf(User);
  });

  it('should delete a User', async () => {
    const input = mockFindUserInput();
    const options = { where: input };
    const res = await resolver.deleteUser(input);
    expect(usersService.delete).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(User);
  });

  it('should find Accounts for a User', async () => {
    const user = mockUser();
    const paginationArgs = mockPaginationArgs();
    const input = mockFindAccountsInput();
    const options = { where: { ...input, user } };
    const res = await resolver.accounts(user, paginationArgs, input);
    expect(accountsService.paginate).toHaveBeenCalledWith(
      paginationArgs,
      options,
      expect.anything(),
    );

    for (const { node } of res.edges) {
      expect(node).toBeInstanceOf(Account);
    }
  });
});
