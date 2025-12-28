import { Test } from '@nestjs/testing';
import { Mocked } from 'vitest';
import { createMockPaginationArgs } from '../../common/graphql/pagination/__mocks__/pagination.args.mock';
import { createMockAccountsService } from '../accounts/__mocks__/accounts.service.mock';
import { AccountsService } from '../accounts/accounts.service';
import { createMockFindAccountsInput } from '../accounts/dto/__mocks__/find-accounts.input.mock';
import { Account } from '../accounts/entities/account.entity';
import { createMockSessionsService } from '../sessions/__mocks__/sessions.service.mock';
import { createMockFindSessionsInput } from '../sessions/dto/__mocks__/find-sessions.input.mock';
import { Session } from '../sessions/entities/session.entity';
import { SessionsService } from '../sessions/sessions.service';
import { createMockUsersService } from './__mocks__/users.service.mock';
import { createMockCreateUserInput } from './dto/__mocks__/create-user.input.mock';
import { createMockFindUserInput } from './dto/__mocks__/find-user.input.mock';
import { createMockFindUsersInput } from './dto/__mocks__/find-users.input.mock';
import { createMockUpdateUserInput } from './dto/__mocks__/update-user.input.mock';
import { createMockUser } from './entities/__mocks__/user.entity.mock';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', async () => {
  const mockUsersService = await createMockUsersService();
  const mockAccountsService = await createMockAccountsService();
  const mockSessionsService = await createMockSessionsService();

  let resolver: UsersResolver;
  let usersService: Mocked<UsersService>;
  let accountsService: Mocked<AccountsService>;
  let sessionsService: Mocked<SessionsService>;

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
        {
          provide: SessionsService,
          useValue: mockSessionsService,
        },
      ],
    }).compile();

    resolver = module.get(UsersResolver);
    usersService = module.get(UsersService);
    accountsService = module.get(AccountsService);
    sessionsService = module.get(SessionsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create a User', async () => {
    const input = await createMockCreateUserInput();
    const options = { data: input };
    const res = await resolver.createUser(input, {});
    expect(usersService.create).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(User);
  });

  it('should find one User', async () => {
    const input = await createMockFindUserInput();
    const options = { where: input };
    const res = await resolver.user(input, {});
    expect(usersService.findUnique).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(User);
  });

  it('should find many Users', async () => {
    const paginationArgs = createMockPaginationArgs();
    const input = await createMockFindUsersInput();
    const options = { where: input };
    const res = await resolver.users(paginationArgs, input, {});
    expect(usersService.paginate).toHaveBeenCalledWith(
      paginationArgs,
      options,
      expect.any(Object),
    );

    for (const { node } of res.edges) {
      expect(node).toBeInstanceOf(User);
    }
  });

  it('should update a User', async () => {
    const input = await createMockUpdateUserInput();
    const { id, ...data } = input;
    const res = await resolver.updateUser(input, {});
    expect(usersService.update).toHaveBeenCalledWith({
      where: { id },
      data,
    });
    expect(res).toBeInstanceOf(User);
  });

  it('should delete a User', async () => {
    const input = await createMockFindUserInput();
    const options = { where: input };
    const res = await resolver.deleteUser(input, {});
    expect(usersService.delete).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(User);
  });

  it('should find Accounts for a User', async () => {
    const paginationArgs = createMockPaginationArgs();
    const user = await createMockUser();
    const input = await createMockFindAccountsInput();
    const options = { where: { ...input, user } };
    const res = await resolver.accounts(user, paginationArgs, input, {});
    expect(accountsService.paginate).toHaveBeenCalledWith(
      paginationArgs,
      options,
      expect.anything(),
    );

    for (const { node } of res.edges) {
      expect(node).toBeInstanceOf(Account);
    }
  });

  it('should find Sessions for a User', async () => {
    const paginationArgs = createMockPaginationArgs();
    const user = await createMockUser();
    const input = await createMockFindSessionsInput();
    const options = { where: { ...input, user } };
    const res = await resolver.sessions(user, paginationArgs, input, {});
    expect(sessionsService.paginate).toHaveBeenCalledWith(
      paginationArgs,
      options,
      expect.anything(),
    );

    for (const { node } of res.edges) {
      expect(node).toBeInstanceOf(Session);
    }
  });
});
