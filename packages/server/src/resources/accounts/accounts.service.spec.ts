import { Test } from '@nestjs/testing';
import { Mocked } from 'vitest';
import { createMockPrismaService } from '../../common/db/__mocks__/prisma.service.mock';
import { PrismaService } from '../../common/db/prisma.service';
import { mockPaginationArgs } from '../../common/graphql/pagination/__mocks__/pagination.args.mock';
import { AccountsService } from './accounts.service';
import { mockCreateAccountInput } from './dto/__mocks__/create-account.input.mock';
import { mockFindAccountInput } from './dto/__mocks__/find-account.input.mock';
import { mockFindAccountsInput } from './dto/__mocks__/find-accounts.input.mock';
import { mockUpdateAccountInput } from './dto/__mocks__/update-account.input.mock';
import { mockAccount } from './entities/__mocks__/account.entity.mock';
import { Account } from './entities/account.entity';

const mockPrismaService = createMockPrismaService('account', mockAccount);

describe('AccountsService', () => {
  let service: AccountsService;
  let prismaService: Mocked<PrismaService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get(AccountsService);
    prismaService = module.get<Mocked<PrismaService>>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a Account', async () => {
    const input = mockCreateAccountInput();
    const options = { data: input };
    mockPrismaService.account?.createManyAndReturn.mockResolvedValueOnce([
      input,
    ] as Account[]);
    const res = await service.create(options);
    expect(prismaService.account.createManyAndReturn).toHaveBeenCalledWith(
      options,
    );

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(input));
    }
  });

  it('should find one Account', async () => {
    const input = mockFindAccountInput();
    const options = { where: input };
    mockPrismaService.account?.findFirst.mockResolvedValueOnce(
      input as Account,
    );
    const res = await service.findOne(options);
    expect(prismaService.account.findFirst).toHaveBeenCalledWith(options);
    expect(res).toEqual(expect.objectContaining(input));
  });

  it('should find many Accounts', async () => {
    const input = mockFindAccountsInput();
    const options = { where: input };
    mockPrismaService.account?.findMany.mockResolvedValueOnce([
      input,
    ] as Account[]);
    const res = await service.findMany(options);
    expect(mockPrismaService.account?.findMany).toHaveBeenCalledWith(options);

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(input));
    }
    ``;
  });

  it('should paginate', async () => {
    const input = mockFindAccountsInput();
    const options = { where: input };
    const paginationArgs = mockPaginationArgs();
    mockPrismaService.account?.findMany.mockResolvedValueOnce([
      input,
    ] as Account[]);
    mockPrismaService.account?.count.mockResolvedValueOnce(1);
    const res = await service.paginate(paginationArgs, options);
    expect(mockPrismaService.account?.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        ...options,
        take: expect.toSatisfy((v) => v >= 0),
        skip: expect.toBeOneOf([0, 1]),
        cursor: expect.toBeOneOf([{ id: expect.any(String) }, undefined]),
        orderBy: { id: 'asc' },
      }),
    );
    expect(mockPrismaService.account?.count).toHaveBeenCalledWith(options);
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

  it('should update Accounts', async () => {
    const findInput = mockFindAccountsInput();
    const updateInput = mockUpdateAccountInput();
    const options = { where: findInput, data: updateInput };
    mockPrismaService.account?.updateManyAndReturn.mockResolvedValueOnce([
      findInput,
    ] as Account[]);
    const res = await service.update(options);
    expect(mockPrismaService.account?.updateManyAndReturn).toHaveBeenCalledWith(
      options,
    );

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(findInput));
    }
  });

  it('should delete Accounts', async () => {
    const input = mockFindAccountsInput();
    const options = { where: input };
    mockPrismaService.account?.findMany.mockResolvedValueOnce([
      input,
    ] as Account[]);
    const res = await service.delete(options);
    expect(mockPrismaService.account?.findMany).toHaveBeenCalledWith(options);
    expect(mockPrismaService.account?.deleteMany).toHaveBeenCalledWith(options);

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(input));
    }
  });

  it('should count Accounts', async () => {
    const input = mockFindAccountsInput();
    const options = { where: input };
    const res = await service.count(options);
    mockPrismaService.account?.count.mockResolvedValueOnce(1);
    expect(mockPrismaService.account?.count).toHaveBeenCalledWith(options);
    expect(res).toBeGreaterThan(0);
  });
});
