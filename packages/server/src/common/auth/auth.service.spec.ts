import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Mocked } from 'vitest';
import { createMockAccountsService } from '../../resources/accounts/__mocks__/accounts.service.mock';
import { AccountsService } from '../../resources/accounts/accounts.service';
import { createMockAccount } from '../../resources/accounts/entities/__mocks__/account.entity.mock';
import { Provider } from '../../resources/accounts/entities/provider.enum';
import { createMockSessionsService } from '../../resources/sessions/__mocks__/sessions.service.mock';
import { createMockSession } from '../../resources/sessions/entities/__mocks__/session.entity.mock';
import { SessionsService } from '../../resources/sessions/sessions.service';
import { createMockUsersService } from '../../resources/users/__mocks__/users.service.mock';
import { createMockUser } from '../../resources/users/entities/__mocks__/user.entity.mock';
import { UsersService } from '../../resources/users/users.service';
import * as argon2 from '../crypto/argon2/argon2.util';
import { mockJwtService } from '../crypto/jwt/__mocks__/jwt.service.mock';
import {
  createMockExpressUser,
  createMockJwtPayload,
} from './__mocks__/auth.type.mock';
import { AuthService } from './auth.service';
import { createMockRegisterInput } from './dto/__mocks__/register.input.mock';

const spyVerify = vi.spyOn(argon2, 'verify');

describe('AuthService', async () => {
  const mockUsersService = await createMockUsersService();
  const mockAccountsService = await createMockAccountsService();
  const mockSessionsService = await createMockSessionsService();

  let service: AuthService;
  let usersService: Mocked<UsersService>;
  let accountsService: Mocked<AccountsService>;
  let sessionsService: Mocked<SessionsService>;
  let jwtService: Mocked<JwtService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
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
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
    usersService = module.get(UsersService);
    accountsService = module.get(AccountsService);
    sessionsService = module.get(SessionsService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate local', async () => {
    const user = await createMockUser();
    const account = await createMockAccount();
    const { username } = user;
    const { password } = account;
    mockUsersService.findUnique.mockReturnValue(user);
    mockAccountsService.findOne.mockReturnValue(account);
    spyVerify.mockResolvedValue(true);
    const res = await service.validateLocal(username, password!);
    expect(usersService.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { username },
      }),
    );
    expect(accountsService.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: user.id, providerId: 'local' },
      }),
    );
    expect(spyVerify).toHaveBeenCalledWith(account.password, password);
    expect(res).toEqual(
      expect.objectContaining({
        id: user.id,
        username: user.username,
        email: user.email,
      }),
    );
  });

  it('should return null on validate local if no User', async () => {
    const user = await createMockUser();
    const account = await createMockAccount();
    const { username } = user;
    const { password } = account;
    mockUsersService.findUnique.mockReturnValue(undefined);
    mockUsersService.findUnique.mockReturnValueOnce(undefined);
    const res = await service.validateLocal(username, password!);
    expect(res).toBeNull();
  });

  it('should return null on validate local if no Account', async () => {
    const user = await createMockUser();
    const account = await createMockAccount();
    const { username } = user;
    const { password } = account;
    mockUsersService.findUnique.mockReturnValue(user);
    mockAccountsService.findOne.mockReturnValue(undefined);
    mockAccountsService.findOne.mockReturnValueOnce(undefined);
    const res = await service.validateLocal(username, password!);
    expect(res).toBeNull();
  });

  it('should return null on validate local if password not verified', async () => {
    const user = await createMockUser();
    const account = await createMockAccount();
    const { username } = user;
    const { password } = account;
    mockUsersService.findUnique.mockReturnValue(user);
    mockAccountsService.findOne.mockReturnValue(account);
    spyVerify.mockResolvedValue(true);
    spyVerify.mockResolvedValueOnce(false);
    const res = await service.validateLocal(username, password!);
    expect(res).toBeNull();
  });

  it('should validate JWT', async () => {
    const jwtPayload = createMockJwtPayload({
      id: faker.number.int(),
      username: faker.internet.username(),
      email: faker.internet.email(),
    });
    const res = await service.validateJwt(jwtPayload);
    expect(res?.username).not.toBeUndefined();
    expect(res).toEqual(
      expect.objectContaining({
        id: jwtPayload.id,
        username: jwtPayload.username,
        email: jwtPayload.email,
      }),
    );
  });

  it('should validate refresh JWT', async () => {
    const session = await createMockSession();
    const expiredSession = await createMockSession({
      expiresAt: faker.date.past(),
    });
    const refreshJwt = faker.string.alphanumeric({ length: 10 });
    const user = await createMockUser();
    jwtService.decode.mockReturnValue({ id: user.id });
    mockSessionsService.findMany.mockResolvedValue([session, expiredSession]);
    spyVerify.mockResolvedValueOnce(true);
    mockUsersService.findUnique.mockResolvedValueOnce(user);
    const res = await service.validateRefreshJwt(refreshJwt);
    expect(jwtService.decode).toHaveBeenCalledWith(refreshJwt);
    expect(sessionsService.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: user.id },
      }),
    );
    expect(sessionsService.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expiredSession,
      }),
    );
    expect(spyVerify).toHaveBeenCalledWith(session.token, refreshJwt);
    expect(res).toEqual(
      expect.objectContaining({
        id: user.id,
        username: user.username,
        email: user.email,
      }),
    );
  });

  it('should return null on validate refresh JWT if no session', async () => {
    const refreshJwt = faker.string.alphanumeric({ length: 10 });
    const user = await createMockUser();
    jwtService.decode.mockReturnValue({ id: user.id });
    mockSessionsService.findMany.mockResolvedValue([]);
    const res = await service.validateRefreshJwt(refreshJwt);
    expect(res).toBeNull();
  });

  it('should return null on validate refresh JWT if no user', async () => {
    const session = await createMockSession();
    const refreshJwt = faker.string.alphanumeric({ length: 10 });
    jwtService.decode.mockReturnValue({ id: faker.number.int() });
    mockSessionsService.findMany.mockResolvedValue([session]);
    spyVerify.mockResolvedValueOnce(true);
    mockUsersService.findUnique.mockResolvedValueOnce(undefined);
    const res = await service.validateRefreshJwt(refreshJwt);
    expect(res).toBeNull();
  });

  it('should register', async () => {
    const input = await createMockRegisterInput();
    const { password, ...createUserInput } = input;
    const user = await createMockUser();
    mockUsersService.create.mockResolvedValueOnce([user]);
    const res = await service.register(input);
    expect(usersService.create).toHaveBeenCalledWith({
      data: createUserInput,
    });
    expect(accountsService.create).toHaveBeenCalledWith({
      data: {
        userId: user.id,
        providerId: Provider.Local,
        accountId: `${user.id}`,
        password,
      },
    });
    expect(res).toBe(user);
  });

  it('should login', async () => {
    const expressUser = createMockExpressUser();
    const ipAddress = faker.internet.ip();
    const userAgent = faker.internet.userAgent();
    const refreshToken = faker.string.alphanumeric({ length: 10 });
    jwtService.signAsync.mockResolvedValue(refreshToken);

    const res = await service.login(expressUser, { ipAddress, userAgent });
    expect(sessionsService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          userId: expressUser.id,
          token: refreshToken,
          expiresAt: expect.any(Date),
          ipAddress,
          userAgent,
        },
      }),
    );
    expect(res).toEqual(
      expect.objectContaining({
        access_token: refreshToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        expires_in: expect.any(Number),
      }),
    );
  });

  it('should refresh', async () => {
    const expressUser = createMockExpressUser();
    const refreshToken = faker.string.alphanumeric({ length: 10 });
    const ipAddress = faker.internet.ip();
    const userAgent = faker.internet.userAgent();
    const session = await createMockSession();
    jwtService.decode.mockReturnValue({ id: expressUser.id });
    mockSessionsService.findMany.mockResolvedValueOnce([session]);
    spyVerify.mockResolvedValueOnce(true);
    jwtService.signAsync.mockResolvedValue(refreshToken);

    const res = await service.refresh(expressUser, refreshToken, {
      ipAddress,
      userAgent,
    });
    expect(sessionsService.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: expressUser.id },
      }),
    );
    expect(sessionsService.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: session.id },
        data: {
          userId: expressUser.id,
          token: refreshToken,
          expiresAt: expect.any(Date),
          ipAddress,
          userAgent,
        },
      }),
    );
    expect(res).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
        token_type: 'Bearer',
        expires_in: expect.any(Number),
      }),
    );
  });

  it('should return null on refresh if no session', async () => {
    const expressUser = createMockExpressUser();
    const refreshToken = faker.string.alphanumeric({ length: 10 });
    const ipAddress = faker.internet.ip();
    const userAgent = faker.internet.userAgent();
    jwtService.decode.mockReturnValue({ id: expressUser.id });
    mockSessionsService.findMany.mockResolvedValueOnce([]);

    const res = await service.refresh(expressUser, refreshToken, {
      ipAddress,
      userAgent,
    });

    expect(res).toBeNull();
  });

  it('should return user info', async () => {
    const expressUser = createMockExpressUser();
    const user = await createMockUser();
    mockUsersService.findUnique.mockResolvedValueOnce(user);
    const res = await service.userInfo(expressUser);
    expect(usersService.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: expressUser.id },
      }),
    );
    expect(res).toBe(user);
  });
});
