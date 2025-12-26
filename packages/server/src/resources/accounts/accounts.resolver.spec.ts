import { Test } from '@nestjs/testing';
import { Mocked } from 'vitest';
import { createMockUsersService } from '../users/__mocks__/users.service.mock';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { createMockAccountsService } from './__mocks__/accounts.service.mock';
import { AccountsResolver } from './accounts.resolver';
import { AccountsService } from './accounts.service';
import { createMockCreateAccountInput } from './dto/__mocks__/create-account.input.mock';
import { createMockFindAccountInput } from './dto/__mocks__/find-account.input.mock';
import { createMockFindAccountsInput } from './dto/__mocks__/find-accounts.input.mock';
import { createMockUpdateAccountInput } from './dto/__mocks__/update-account.input.mock';
import { createMockAccount } from './entities/__mocks__/account.entity.mock';
import { Account } from './entities/account.entity';

describe('AccountsResolver', () => {
  const mockAccountsService = createMockAccountsService();
  const mockUsersService = createMockUsersService();

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
    accountsService = module.get(AccountsService);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create an Account', async () => {
    const input = await createMockCreateAccountInput();
    const options = { data: input };
    const res = await resolver.createAccount(input);
    expect(accountsService.create).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(Account);
  });

  it('should find one Account', async () => {
    const input = await createMockFindAccountInput();
    const options = { where: input };
    const res = await resolver.account(input, {});
    expect(accountsService.findUnique).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(Account);
  });

  it('should find many Accounts', async () => {
    const input = await createMockFindAccountsInput();
    const { first, after, last, before, ...rest } = input;
    const options = { where: rest };
    const res = await resolver.accounts(input, {});
    expect(accountsService.paginate).toHaveBeenCalledWith(
      { first, after, last, before },
      options,
      expect.anything(),
    );

    for (const { node } of res.edges) {
      expect(node).toBeInstanceOf(Account);
    }
  });

  it('should update a Account', async () => {
    const input = await createMockUpdateAccountInput();
    const { id, ...data } = input;
    const res = await resolver.updateAccount(input);
    expect(accountsService.update).toHaveBeenCalledWith({
      where: { id },
      data,
    });
    expect(res).toBeInstanceOf(Account);
  });

  it('should delete a Account', async () => {
    const input = await createMockFindAccountInput();
    const options = { where: input };
    const res = await resolver.deleteAccount(input);
    expect(accountsService.delete).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(Account);
  });

  it('should find a User for an Account', async () => {
    const account = await createMockAccount();
    const options = { where: { accounts: { some: { id: account.id } } } };
    const res = await resolver.user(account, {});
    expect(usersService.findOne).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(User);
  });
});
