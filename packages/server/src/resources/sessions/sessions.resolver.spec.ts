import { Test } from '@nestjs/testing';
import { Mocked } from 'vitest';
import { createMockPaginationArgs } from '../../common/graphql/pagination/__mocks__/pagination.args.mock';
import { createMockUsersService } from '../users/__mocks__/users.service.mock';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { createMockSessionsService } from './__mocks__/sessions.service.mock';
import { createMockCreateSessionInput } from './dto/__mocks__/create-session.input.mock';
import { createMockFindSessionInput } from './dto/__mocks__/find-session.input.mock';
import { createMockFindSessionsInput } from './dto/__mocks__/find-sessions.input.mock';
import { createMockUpdateSessionInput } from './dto/__mocks__/update-session.input.mock';
import { createMockSession } from './entities/__mocks__/session.entity.mock';
import { Session } from './entities/session.entity';
import { SessionsResolver } from './sessions.resolver';
import { SessionsService } from './sessions.service';

const mockSessionsService = createMockSessionsService();
const mockUsersService = createMockUsersService();

describe('SessionsResolver', () => {
  let resolver: SessionsResolver;
  let sessionsService: Mocked<SessionsService>;
  let usersService: Mocked<UsersService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SessionsResolver,
        {
          provide: SessionsService,
          useValue: mockSessionsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    resolver = module.get(SessionsResolver);
    sessionsService = module.get(SessionsService);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create a Session', async () => {
    const input = await createMockCreateSessionInput();
    const options = { data: input };
    const res = await resolver.createSession(input, {});
    expect(sessionsService.create).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(Session);
  });

  it('should find one Session', async () => {
    const input = await createMockFindSessionInput();
    const options = { where: input };
    const res = await resolver.session(input, {});
    expect(sessionsService.findUnique).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(Session);
  });

  it('should find many Sessions', async () => {
    const paginationArgs = createMockPaginationArgs();
    const input = await createMockFindSessionsInput();
    const options = { where: input };
    const res = await resolver.sessions(paginationArgs, input, {});
    expect(sessionsService.paginate).toHaveBeenCalledWith(
      paginationArgs,
      options,
      expect.any(Object),
    );

    for (const { node } of res.edges) {
      expect(node).toBeInstanceOf(Session);
    }
  });

  it('should update a Session', async () => {
    const input = await createMockUpdateSessionInput();
    const { id, ...data } = input;
    const res = await resolver.updateSession(input, {});
    expect(sessionsService.update).toHaveBeenCalledWith({
      where: { id },
      data,
    });
    expect(res).toBeInstanceOf(Session);
  });

  it('should delete a Session', async () => {
    const input = await createMockFindSessionInput();
    const options = { where: input };
    const res = await resolver.deleteSession(input, {});
    expect(sessionsService.delete).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(Session);
  });

  it('should find a User for an Session', async () => {
    const session = await createMockSession();
    const options = { where: { sessions: { some: { id: session.id } } } };
    const res = await resolver.user(session, {});
    expect(usersService.findOne).toHaveBeenCalledWith(options);
    expect(res).toBeInstanceOf(User);
  });
});
