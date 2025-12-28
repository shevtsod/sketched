import { Test } from '@nestjs/testing';
import { Mocked } from 'vitest';
import { hash } from '../../common/crypto/argon2/argon2.util';
import { createMockPrismaService } from '../../common/db/__mocks__/prisma.service.mock';
import { PrismaService } from '../../common/db/prisma.service';
import { createMockPaginationArgs } from '../../common/graphql/pagination/__mocks__/pagination.args.mock';
import { createMockCreateSessionInput } from './dto/__mocks__/create-session.input.mock';
import { createMockFindSessionInput } from './dto/__mocks__/find-session.input.mock';
import { createMockFindSessionsInput } from './dto/__mocks__/find-sessions.input.mock';
import { createMockUpdateSessionInput } from './dto/__mocks__/update-session.input.mock';
import { createMockSession } from './entities/__mocks__/session.entity.mock';
import { Session } from './entities/session.entity';
import { SessionsService } from './sessions.service';

vi.mock('../../common/crypto/argon2/argon2.util', { spy: true });

describe('SessionsService', async () => {
  const mockPrismaService = await createMockPrismaService(
    'session',
    createMockSession,
  );

  let service: SessionsService;
  let prismaService: Mocked<PrismaService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get(SessionsService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a Session', async () => {
    const input = await createMockCreateSessionInput();
    const { token, ...inputRest } = input;
    const options = { data: input };
    mockPrismaService.session?.createManyAndReturn.mockImplementationOnce(
      (input) => [input.data] as Session[],
    );
    const res = await service.create(options);
    expect(prismaService.session.createManyAndReturn).toHaveBeenCalledWith(
      options,
    );
    expect(hash).toHaveBeenCalledWith(token);

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(inputRest));
      expect(item.token).not.toEqual(token);
      expect(item.token?.startsWith('$argon2id$')).is.true;
    }
  });

  it('should find one Session', async () => {
    const input = await createMockFindSessionsInput();
    const options = { where: input };
    mockPrismaService.session?.findFirst.mockResolvedValueOnce(
      input as Session,
    );
    const res = await service.findOne(options);
    expect(prismaService.session.findFirst).toHaveBeenCalledWith(options);
    expect(res).toEqual(expect.objectContaining(input));
  });

  it('should find unique Session', async () => {
    const input = await createMockFindSessionInput();
    const options = { where: input };
    mockPrismaService.session?.findUnique.mockResolvedValueOnce(
      input as Session,
    );
    const res = await service.findUnique(options);
    expect(prismaService.session.findUnique).toHaveBeenCalledWith(options);
    expect(res).toEqual(expect.objectContaining(input));
  });

  it('should find many Sessions', async () => {
    const input = await createMockFindSessionsInput();
    const options = { where: input };
    mockPrismaService.session?.findMany.mockResolvedValueOnce([
      input,
    ] as Session[]);
    const res = await service.findMany(options);
    expect(mockPrismaService.session?.findMany).toHaveBeenCalledWith(options);

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(input));
    }
    ``;
  });

  it('should paginate', async () => {
    const input = await createMockFindSessionsInput();
    const options = { where: input };
    const paginationArgs = createMockPaginationArgs();
    mockPrismaService.session?.findMany.mockResolvedValueOnce([
      input,
    ] as Session[]);
    mockPrismaService.session?.count.mockResolvedValueOnce(1);
    const res = await service.paginate(paginationArgs, options);
    expect(mockPrismaService.session?.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        ...options,
        take: expect.toSatisfy((v) => v >= 0),
        skip: expect.toBeOneOf([0, 1]),
        cursor: expect.toBeOneOf([{ id: expect.any(String) }, undefined]),
        orderBy: { id: 'asc' },
      }),
    );
    expect(mockPrismaService.session?.count).toHaveBeenCalledWith(options);
    expect(res).toEqual(
      expect.objectContaining({
        edges: expect.any(Array),
        pageInfo: expect.objectContaining({
          startCursor: expect.any(String),
          endCursor: expect.any(String),
        }),
        totalCount: expect.any(Number),
      }),
    );

    for (const edge of res.edges) {
      expect(edge.cursor).toEqual(expect.any(String));
      expect(edge.node).toEqual(expect.objectContaining(input));
    }

    expect(res.edges.length).toBe(1);
  });

  it('should update Sessions', async () => {
    const findInput = await createMockFindSessionsInput();
    const updateInput = await createMockUpdateSessionInput();
    const { token, ...updateInputRest } = updateInput;
    const options = { where: findInput, data: updateInput };
    mockPrismaService.session?.updateManyAndReturn.mockImplementation(
      (input) => [input.data] as Session[],
    );
    const res = await service.update(options);
    expect(mockPrismaService.session?.updateManyAndReturn).toHaveBeenCalledWith(
      options,
    );
    expect(hash).toHaveBeenCalledWith(token);

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(updateInputRest));
      expect(item.token).not.toEqual(token);
      expect(item.token?.startsWith('$argon2id$')).is.true;
    }
  });

  it('should upsert Sessions', async () => {
    const findInput = await createMockFindSessionInput();
    const createInput = await createMockCreateSessionInput();
    const { token: createToken } = createInput;
    const updateInput = await createMockUpdateSessionInput();
    const { token: updateToken } = updateInput;
    const options = {
      where: findInput,
      create: createInput,
      update: updateInput,
    };
    mockPrismaService.session?.upsert.mockResolvedValueOnce(
      createInput as Session,
    );
    const res = await service.upsert(options);
    expect(mockPrismaService.session?.upsert).toHaveBeenCalledWith(options);
    expect(res).toEqual(expect.objectContaining(createInput));
    expect(hash).toHaveBeenCalledWith(createToken);
    expect(hash).toHaveBeenCalledWith(updateToken);
  });

  it('should delete Sessions', async () => {
    const input = await createMockFindSessionsInput();
    const options = { where: input };
    mockPrismaService.session?.findMany.mockResolvedValueOnce([
      input,
    ] as Session[]);
    const res = await service.delete(options);
    expect(mockPrismaService.session?.findMany).toHaveBeenCalledWith(options);
    expect(mockPrismaService.session?.deleteMany).toHaveBeenCalledWith(options);

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(input));
    }
  });

  it('should count Sessions', async () => {
    const input = await createMockFindSessionsInput();
    const options = { where: input };
    const res = await service.count(options);
    mockPrismaService.session?.count.mockResolvedValueOnce(1);
    expect(mockPrismaService.session?.count).toHaveBeenCalledWith(options);
    expect(res).toBeGreaterThan(0);
  });
});
