import { Test } from '@nestjs/testing';
import { Mocked } from 'vitest';
import { hash } from '../../common/crypto/argon2/argon2.util';
import { createMockPrismaService } from '../../common/db/__mocks__/prisma.service.mock';
import { PrismaService } from '../../common/db/prisma.service';
import { createMockPaginationArgs } from '../../common/graphql/pagination/__mocks__/pagination.args.mock';
import { AccountsService } from './accounts.service';
import { createMockCreateAccountInput } from './dto/__mocks__/create-account.input.mock';
import { createMockFindAccountInput } from './dto/__mocks__/find-account.input.mock';
import { createMockFindAccountsInput } from './dto/__mocks__/find-accounts.input.mock';
import { createMockUpdateAccountInput } from './dto/__mocks__/update-account.input.mock';
import { createMockAccount } from './entities/__mocks__/account.entity.mock';
import { Account } from './entities/account.entity';

vi.mock('../../common/crypto/argon2/argon2.util', { spy: true });

describe('AccountsService', async () => {
  const mockPrismaService = await createMockPrismaService(
    'account',
    createMockAccount,
  );

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
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a Account', async () => {
    const input = await createMockCreateAccountInput();
    const { password, ...inputRest } = input;
    const options = { data: input };
    mockPrismaService.account?.createManyAndReturn.mockImplementationOnce(
      (input) => [input.data] as Account[],
    );
    const res = await service.create(options);
    expect(prismaService.account.createManyAndReturn).toHaveBeenCalledWith(
      options,
    );
    expect(hash).toHaveBeenCalledWith(password);

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(inputRest));
      expect(item.password).not.toEqual(password);
      expect(item.password?.startsWith('$argon2id$')).is.true;
    }
  });

  it('should find one Account', async () => {
    const input = await createMockFindAccountsInput();
    const options = { where: input };
    mockPrismaService.account?.findFirst.mockResolvedValueOnce(
      input as Account,
    );
    const res = await service.findOne(options);
    expect(prismaService.account.findFirst).toHaveBeenCalledWith(options);
    expect(res).toEqual(expect.objectContaining(input));
  });

  it('should find unique Account', async () => {
    const input = await createMockFindAccountInput();
    const options = { where: input };
    mockPrismaService.account?.findUnique.mockResolvedValueOnce(
      input as Account,
    );
    const res = await service.findUnique(options);
    expect(prismaService.account.findUnique).toHaveBeenCalledWith(options);
    expect(res).toEqual(expect.objectContaining(input));
  });

  it('should find many Accounts', async () => {
    const input = await createMockFindAccountsInput();
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
    const input = await createMockFindAccountsInput();
    const options = { where: input };
    const paginationArgs = createMockPaginationArgs();
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
    const findInput = await createMockFindAccountsInput();
    const updateInput = await createMockUpdateAccountInput();
    const { password, ...updateInputRest } = updateInput;
    const options = { where: findInput, data: updateInput };
    mockPrismaService.account?.updateManyAndReturn.mockImplementation(
      (input) => [input.data] as Account[],
    );
    const res = await service.update(options);
    expect(mockPrismaService.account?.updateManyAndReturn).toHaveBeenCalledWith(
      options,
    );
    expect(hash).toHaveBeenCalledWith(password);

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(updateInputRest));
      expect(item.password).not.toEqual(password);
      expect(item.password?.startsWith('$argon2id$')).is.true;
    }
  });

  it('should upsert Accounts', async () => {
    const findInput = await createMockFindAccountInput();
    const createInput = await createMockCreateAccountInput();
    const { password: createPassword } = createInput;
    const updateInput = await createMockUpdateAccountInput();
    const { password: updatePassword } = updateInput;
    const options = {
      where: findInput,
      create: createInput,
      update: updateInput,
    };
    mockPrismaService.account?.upsert.mockResolvedValueOnce(
      createInput as Account,
    );
    const res = await service.upsert(options);
    expect(mockPrismaService.account?.upsert).toHaveBeenCalledWith(options);

    expect(res).toEqual(expect.objectContaining(createInput));
    expect(hash).toHaveBeenCalledWith(createPassword);
    expect(hash).toHaveBeenCalledWith(updatePassword);
  });

  it('should delete Accounts', async () => {
    const input = await createMockFindAccountsInput();
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
    const input = await createMockFindAccountsInput();
    const options = { where: input };
    const res = await service.count(options);
    mockPrismaService.account?.count.mockResolvedValueOnce(1);
    expect(mockPrismaService.account?.count).toHaveBeenCalledWith(options);
    expect(res).toBeGreaterThan(0);
  });
});
