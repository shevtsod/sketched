import { Test } from '@nestjs/testing';
import { Mocked } from 'vitest';
import { mockPaginationArgs } from '../../common/graphql/pagination/__mocks__/pagination.args.mock';
import { createMockUsersService } from '../users/__mocks__/users.service.mock';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { createMockAccountsService } from './__mocks__/accounts.service.mock';
import { AccountsResolver } from './accounts.resolver';
import { AccountsService } from './accounts.service';
import { mockCreateAccountInput } from './dto/__mocks__/create-account.input.mock';
import { mockFindAccountInput } from './dto/__mocks__/find-account.input.mock';
import { mockFindAccountsInput } from './dto/__mocks__/find-accounts.input.mock';
import { mockUpdateAccountInput } from './dto/__mocks__/update-account.input.mock';
import { mockAccount } from './entities/__mocks__/account.entity.mock';
import { Account } from './entities/account.entity';

const mockAccountsService = createMockAccountsService();
const mockUsersService = createMockUsersService();

describe('AccountsResolver', () => {
  let resolver: AccountsResolver;
  let accountsService: Mocked<AccountsService>;
  let usersService: Mocked<UsersService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccountsResolver,
        {
          provide: AccountsService,
          useValue: mockAccountsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    resolver = module.get(AccountsResolver);
    accountsService = module.get<Mocked<AccountsService>>(AccountsService);
    usersService = module.get<Mocked<UsersService>>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create an Account', async () => {
    const input = mockCreateAccountInput();
    const options = { data: input };
    const res = await resolver.createAccount(input);
    expect(accountsService.create).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(Account);
  });

  it('should find one Account', async () => {
    const input = mockFindAccountInput();
    const options = { where: input };
    const res = await resolver.account(input);
    expect(accountsService.findOne).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(Account);
  });

  it('should find many Accounts', async () => {
    const paginationArgs = mockPaginationArgs();
    const input = mockFindAccountsInput();
    const options = { where: input };
    const res = await resolver.accounts(paginationArgs, input);
    expect(accountsService.paginate).toHaveBeenCalledWith(
      paginationArgs,
      options,
      expect.anything(),
    );

    for (const { node } of res.edges) {
      expect(node).toBeInstanceOf(Account);
    }
  });

  it('should update a Account', async () => {
    const input = mockUpdateAccountInput();
    const { id, ...data } = input;
    const res = await resolver.updateAccount(input);
    expect(accountsService.update).toHaveBeenCalledWith({
      where: { id },
      data,
    });
    expect(res).toBeInstanceOf(Account);
  });

  it('should delete a Account', async () => {
    const input = mockFindAccountInput();
    const options = { where: input };
    const res = await resolver.deleteAccount(input);
    expect(accountsService.delete).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(Account);
  });

  it('should find a User for an Account', async () => {
    const account = mockAccount();
    const options = { where: { accounts: { some: { id: account.id } } } };
    const res = await resolver.user(account);
    expect(usersService.findOne).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(User);
  });
});
