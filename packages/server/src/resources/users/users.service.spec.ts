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

describe('UsersService', () => {
  let service: UsersService;
  let dbService: Mocked<DbService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DbService,
          useValue: createMockDbService(mockUser),
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
    const res = await service.create(input);
    expect(dbService.create).toHaveBeenCalledWith(users, [input]);
    expect(res).toBeInstanceOf(User);
  });

  it('should find one User', async () => {
    const options = {
      where: and(
        ...Object.entries(mockFindUserInput()).map(([k, v]) => eq(users[k], v)),
      ),
    };
    const res = await service.findOne(options);
    expect(dbService.findOne).toHaveBeenCalledWith(users, options);
    expect(res).toBeInstanceOf(User);
  });

  it('should find many Users', async () => {
    const options = {
      where: and(
        ...Object.entries(mockFindUsersInput()).map(([k, v]) =>
          eq(users[k], v),
        ),
      ),
    };
    const res = await service.findMany(options);
    expect(dbService.findMany).toHaveBeenCalledWith(users, options);

    for (const item of res) {
      expect(item).toBeInstanceOf(User);
    }
  });

  it('should find many Users with count', async () => {
    const options = {
      where: and(
        ...Object.entries(mockFindUsersInput()).map(([k, v]) =>
          eq(users[k], v),
        ),
      ),
    };
    const [res, count] = await service.findManyWithCount(options, options);
    expect(dbService.findManyWithCount).toHaveBeenCalledWith(
      users,
      options,
      options,
    );

    for (const item of res) {
      expect(item).toBeInstanceOf(User);
    }

    expect(count).toBe(res.length);
  });

  it('should update Users', async () => {
    const where = and(
      ...Object.entries(mockFindUsersInput()).map(([k, v]) => eq(users[k], v)),
    );
    const set = mockUpdateUserInput();
    const res = await service.update(where, set);
    expect(dbService.update).toHaveBeenCalledWith(users, where, set);

    for (const item of res) {
      expect(item).toBeInstanceOf(User);
    }
  });

  it('should delete Users', async () => {
    const where = and(
      ...Object.entries(mockFindUsersInput()).map(([k, v]) => eq(users[k], v)),
    );
    const res = await service.delete(where);
    expect(dbService.delete).toHaveBeenCalledWith(users, where);

    for (const item of res) {
      expect(item).toBeInstanceOf(User);
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
