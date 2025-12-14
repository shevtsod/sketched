import { Test } from '@nestjs/testing';
import { Mocked } from 'vitest';
import { createMockPrismaService } from '../../common/db/__mocks__/prisma.service.mock';
import { PrismaService } from '../../common/db/prisma.service';
import { mockPaginationArgs } from '../../common/graphql/pagination/__mocks__/pagination.args.mock';
import { mockCreateUserInput } from './dto/__mocks__/create-user.input.mock';
import { mockFindUserInput } from './dto/__mocks__/find-user.input.mock';
import { mockFindUsersInput } from './dto/__mocks__/find-users.input.mock';
import { mockUpdateUserInput } from './dto/__mocks__/update-user.input.mock';
import { mockUser } from './entities/__mocks__/user.entity.mock';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockPrismaService = createMockPrismaService('user', mockUser);

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: Mocked<PrismaService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get(UsersService);
    prismaService = module.get<Mocked<PrismaService>>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a User', async () => {
    const input = mockCreateUserInput();
    const options = { data: input };
    mockPrismaService.user?.createManyAndReturn.mockResolvedValueOnce([
      input,
    ] as User[]);
    const res = await service.create(options);
    expect(prismaService.user.createManyAndReturn).toHaveBeenCalledWith(
      options,
    );

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(input));
    }
  });

  it('should find one User', async () => {
    const input = mockFindUserInput();
    const options = { where: input };
    mockPrismaService.user?.findFirst.mockResolvedValueOnce(input as User);
    const res = await service.findOne(options);
    expect(prismaService.user.findFirst).toHaveBeenCalledWith(options);
    expect(res).toEqual(expect.objectContaining(input));
  });

  it('should find many Users', async () => {
    const input = mockFindUsersInput();
    const options = { where: input };
    mockPrismaService.user?.findMany.mockResolvedValueOnce([input] as User[]);
    const res = await service.findMany(options);
    expect(mockPrismaService.user?.findMany).toHaveBeenCalledWith(options);

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(input));
    }
    ``;
  });

  it('should paginate', async () => {
    const input = mockFindUsersInput();
    const options = { where: input };
    const paginationArgs = mockPaginationArgs();
    mockPrismaService.user?.findMany.mockResolvedValueOnce([input] as User[]);
    mockPrismaService.user?.count.mockResolvedValueOnce(1);
    const res = await service.paginate(paginationArgs, options);
    expect(mockPrismaService.user?.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        ...options,
        take: expect.toSatisfy((v) => v >= 0),
        skip: expect.toBeOneOf([0, 1]),
        cursor: expect.toBeOneOf([{ id: expect.any(String) }, undefined]),
        orderBy: { id: 'asc' },
      }),
    );
    expect(mockPrismaService.user?.count).toHaveBeenCalledWith(options);
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

  it('should update Users', async () => {
    const findInput = mockFindUsersInput();
    const updateInput = mockUpdateUserInput();
    const options = { where: findInput, data: updateInput };
    mockPrismaService.user?.updateManyAndReturn.mockResolvedValueOnce([
      findInput,
    ] as User[]);
    const res = await service.update(options);
    expect(mockPrismaService.user?.updateManyAndReturn).toHaveBeenCalledWith(
      options,
    );

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(findInput));
    }
  });

  it('should delete Users', async () => {
    const input = mockFindUsersInput();
    const options = { where: input };
    mockPrismaService.user?.findMany.mockResolvedValueOnce([input] as User[]);
    const res = await service.delete(options);
    expect(mockPrismaService.user?.findMany).toHaveBeenCalledWith(options);
    expect(mockPrismaService.user?.deleteMany).toHaveBeenCalledWith(options);

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(input));
    }
  });

  it('should count Users', async () => {
    const input = mockFindUsersInput();
    const options = { where: input };
    const res = await service.count(options);
    mockPrismaService.user?.count.mockResolvedValueOnce(1);
    expect(mockPrismaService.user?.count).toHaveBeenCalledWith(options);
    expect(res).toBeGreaterThan(0);
  });
});
