import { Test } from '@nestjs/testing';
import { and, eq } from 'drizzle-orm';
import { Mocked } from 'vitest';
import { createMockDbService } from '../../common/db/__mocks__/db.service.mock';
import { DbService } from '../../common/db/db.service';
import { users } from '../../common/db/schema';
import { mockCreateUserInput } from './dto/__mocks__/create-user.input.mock';
import { mockFindUserInput } from './dto/__mocks__/find-user.input.mock';
import { mockFindUsersInput } from './dto/__mocks__/find-users.input.mock';
import { mockUpdateUserInput } from './dto/__mocks__/update-user.input.mock';
import { mockUser } from './entities/__mocks__/user.entity.mock';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockDbService = createMockDbService(mockUser);

describe('UsersService', () => {
  let service: UsersService;
  let dbService: Mocked<DbService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DbService,
          useValue: mockDbService,
        },
      ],
    }).compile();

    service = module.get(UsersService);
    dbService = module.get<Mocked<DbService>>(DbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a User', async () => {
    const input = mockCreateUserInput();
    mockDbService.create.mockResolvedValueOnce(input as User);
    const res = await service.create([input]);
    expect(dbService.create).toHaveBeenCalledWith(users, [input]);
    expect(res).toEqual(expect.objectContaining(input));
  });

  it('should find one User', async () => {
    const input = mockFindUserInput();
    const options = {
      where: and(...Object.entries(input).map(([k, v]) => eq(users[k], v))),
    };
    mockDbService.findOne.mockResolvedValueOnce(input as User);
    const res = await service.findOne(options);
    expect(dbService.findOne).toHaveBeenCalledWith(users, options);
    expect(res).toEqual(expect.objectContaining(input));
  });

  it('should find many Users', async () => {
    const input = mockFindUsersInput();
    const options = {
      where: and(...Object.entries(input).map(([k, v]) => eq(users[k], v))),
    };
    mockDbService.findMany.mockResolvedValueOnce([input] as User[]);
    const res = await service.findMany(options);
    expect(dbService.findMany).toHaveBeenCalledWith(users, options);

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(input));
    }
  });

  it('should find many Users with count', async () => {
    const input = mockFindUsersInput();
    const options = {
      where: and(...Object.entries(input).map(([k, v]) => eq(users[k], v))),
    };
    mockDbService.findManyWithCount.mockResolvedValueOnce([[input], 1] as [
      User[],
      number,
    ]);
    const [res, count] = await service.findManyWithCount(options, options);
    expect(dbService.findManyWithCount).toHaveBeenCalledWith(
      users,
      options,
      options,
    );

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(input));
    }

    expect(count).toBe(res.length);
  });

  it('should update Users', async () => {
    const input = mockFindUsersInput();
    const where = and(
      ...Object.entries(input).map(([k, v]) => eq(users[k], v)),
    );
    const set = mockUpdateUserInput();
    mockDbService.update.mockResolvedValueOnce([input] as User[]);
    const res = await service.update(where, set);
    expect(dbService.update).toHaveBeenCalledWith(users, where, set);

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(input));
    }
  });

  it('should delete Users', async () => {
    const input = mockFindUsersInput();
    const where = and(
      ...Object.entries(input).map(([k, v]) => eq(users[k], v)),
    );
    mockDbService.delete.mockResolvedValueOnce([input] as User[]);
    const res = await service.delete(where);
    expect(dbService.delete).toHaveBeenCalledWith(users, where);

    for (const item of res) {
      expect(item).toEqual(expect.objectContaining(input));
    }
  });

  it('should count Users', async () => {
    const where = and(
      ...Object.entries(mockFindUsersInput()).map(([k, v]) => eq(users[k], v)),
    );
    const res = await service.count(where);
    expect(dbService.count).toHaveBeenCalledWith(users, where);
    expect(res).toBeGreaterThan(0);
  });
});
