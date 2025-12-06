import { Test } from '@nestjs/testing';
import { eq, InferSelectModel } from 'drizzle-orm';
import { bigint, pgTable, varchar } from 'drizzle-orm/pg-core';
import { DbService } from './db.service';
import { DrizzleService } from './drizzle.service';

const testSchema = pgTable('test', {
  id: bigint({ mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  name: varchar({ length: 256 }).notNull(),
});

type TestEntity = InferSelectModel<typeof testSchema>;

const data: TestEntity[] = [
  { id: 1, name: 'Entity 1' },
  { id: 2, name: 'Entity 2' },
];

describe('DbService', () => {
  let service: DbService;
  let mockDrizzleService: { db: Record<string, jest.Mock> };
  let drizzleService: jest.Mocked<DrizzleService>;

  beforeEach(async () => {
    mockDrizzleService = {
      db: {
        $count: jest.fn().mockReturnThis(),
        $dynamic: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        transaction: jest.fn((fn) => fn()),
        update: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
      },
    };

    const app = await Test.createTestingModule({
      providers: [
        DbService,
        {
          provide: DrizzleService,
          useValue: mockDrizzleService,
        },
      ],
    }).compile();

    service = app.get(DbService);
    drizzleService = app.get<jest.Mocked<DrizzleService>>(DrizzleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a record', async () => {
    const data = [{ name: 'test' }];
    mockDrizzleService.db.returning.mockReturnValue([...data, ...data]);

    const res = await service.create(testSchema, data);
    expect(mockDrizzleService.db.insert).toHaveBeenCalledTimes(1);
    expect(res).toEqual(expect.arrayContaining(data));
  });

  it('should find many records', async () => {
    mockDrizzleService.db.$dynamic.mockReturnValue(data);

    const res = await service.findMany(testSchema);
    expect(mockDrizzleService.db.select).toHaveBeenCalledTimes(1);
    expect(mockDrizzleService.db.where).not.toHaveBeenCalled();
    expect(mockDrizzleService.db.limit).not.toHaveBeenCalled();
    expect(mockDrizzleService.db.orderBy).not.toHaveBeenCalled();
    expect(res).toEqual(data);
  });

  it('should find many records with options', async () => {
    const where = eq(testSchema.id, 1);
    const limit = 1;
    const orderBy = [testSchema.id];
    mockDrizzleService.db.orderBy.mockReturnValue(data);

    const res = await service.findMany(testSchema, {
      where,
      limit,
      orderBy,
    });
    expect(mockDrizzleService.db.select).toHaveBeenCalledTimes(1);
    expect(mockDrizzleService.db.where).toHaveBeenCalledWith(where);
    expect(mockDrizzleService.db.limit).toHaveBeenCalledWith(limit);
    expect(mockDrizzleService.db.orderBy).toHaveBeenCalledWith(...orderBy);
    expect(res).toEqual(data);
  });

  it('should find many records with count', async () => {
    mockDrizzleService.db.$dynamic.mockReturnValue(data);
    mockDrizzleService.db.$count.mockReturnValue(data.length);

    const res = await service.findManyWithCount(testSchema);
    expect(mockDrizzleService.db.transaction).toHaveBeenCalledTimes(1);
    expect(mockDrizzleService.db.select).toHaveBeenCalledTimes(1);
    expect(mockDrizzleService.db.where).not.toHaveBeenCalled();
    expect(mockDrizzleService.db.limit).not.toHaveBeenCalled();
    expect(mockDrizzleService.db.orderBy).not.toHaveBeenCalled();
    expect(mockDrizzleService.db.$count).toHaveBeenCalledWith(
      testSchema,
      undefined,
    );
    expect(res).toEqual([data, data.length]);
  });

  it('should find many records with count and options', async () => {
    const where = eq(testSchema.id, 1);
    const limit = 1;
    const orderBy = [testSchema.id];
    mockDrizzleService.db.orderBy.mockReturnValue(data);
    mockDrizzleService.db.$count.mockReturnValue(data.length);

    const res = await service.findManyWithCount(testSchema, {
      where,
      limit,
      orderBy,
    });
    expect(mockDrizzleService.db.transaction).toHaveBeenCalledTimes(1);
    expect(mockDrizzleService.db.select).toHaveBeenCalledTimes(1);
    expect(mockDrizzleService.db.where).toHaveBeenCalledWith(where);
    expect(mockDrizzleService.db.limit).toHaveBeenCalledWith(limit);
    expect(mockDrizzleService.db.orderBy).toHaveBeenCalledWith(...orderBy);
    expect(mockDrizzleService.db.$count).toHaveBeenCalledWith(
      testSchema,
      where,
    );
    expect(res).toEqual([data, data.length]);
  });

  it('should find a record', async () => {
    mockDrizzleService.db.$dynamic.mockReturnValue(data);

    const res = await service.findOne(testSchema);
    expect(mockDrizzleService.db.select).toHaveBeenCalledTimes(1);
    expect(mockDrizzleService.db.where).not.toHaveBeenCalled();
    expect(mockDrizzleService.db.limit).toHaveBeenCalledWith(1);
    expect(mockDrizzleService.db.orderBy).not.toHaveBeenCalled();
    expect(res).toEqual(data[0]);
  });

  it('should find a record with options', async () => {
    const where = eq(testSchema.id, 1);
    const orderBy = [testSchema.id];
    mockDrizzleService.db.orderBy.mockReturnValue(data);

    const res = await service.findOne(testSchema, { where, orderBy });
    expect(mockDrizzleService.db.select).toHaveBeenCalledTimes(1);
    expect(mockDrizzleService.db.where).toHaveBeenCalledWith(where);
    expect(mockDrizzleService.db.limit).toHaveBeenCalledWith(1);
    expect(mockDrizzleService.db.orderBy).toHaveBeenCalledWith(...orderBy);
    expect(res).toEqual(data[0]);
  });

  it('should update a record', async () => {
    const where = eq(testSchema.id, 1);
    const set = { name: 'test' };
    mockDrizzleService.db.returning.mockReturnValue(data);

    const res = await service.update(testSchema, where, set);
    expect(mockDrizzleService.db.set).toHaveBeenCalledTimes(1);
    expect(res).toEqual(data);
  });

  it('should delete a record', async () => {
    const where = eq(testSchema.id, 1);
    mockDrizzleService.db.returning.mockReturnValue(data);

    const res = await service.delete(testSchema, where);
    expect(mockDrizzleService.db.delete).toHaveBeenCalledTimes(1);
    expect(res).toEqual(data);
  });

  it('should count records', async () => {
    mockDrizzleService.db.$count.mockReturnValue(data.length);

    const res = await service.count(testSchema);
    expect(res).toEqual(data.length);
  });

  it('should count records with options', async () => {
    const where = eq(testSchema.id, 1);
    mockDrizzleService.db.$count.mockReturnValue(data.length);

    const res = await service.count(testSchema, { where });
    expect(mockDrizzleService.db.$count).toHaveBeenCalledWith(
      testSchema,
      where,
    );
    expect(res).toEqual(data.length);
  });
});
