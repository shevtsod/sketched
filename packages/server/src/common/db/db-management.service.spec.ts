import { Test } from '@nestjs/testing';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { reset, seed } from 'drizzle-seed';
import { Mocked } from 'vitest';
import { mockDrizzleService } from './__mocks__/drizzle.service.mock';
import { DbManagementService } from './db-management.service';
import { DrizzleService } from './drizzle.service';

vi.mock('drizzle-seed');
vi.mock('drizzle-orm/node-postgres/migrator');

describe('DbManagementService', () => {
  let service: DbManagementService;
  let drizzleService: Mocked<DrizzleService>;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        DbManagementService,
        {
          provide: DrizzleService,
          useValue: mockDrizzleService,
        },
      ],
    }).compile();

    service = app.get(DbManagementService);
    drizzleService = app.get<Mocked<DrizzleService>>(DrizzleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should drop the database', async () => {
    await service.drop();

    for (const schema of ['public', 'drizzle']) {
      expect(drizzleService.db.execute).toHaveBeenCalledWith(
        sql.raw(`DROP SCHEMA ${schema} CASCADE`),
      );
      expect(drizzleService.db.execute).toHaveBeenCalledWith(
        sql.raw(`CREATE SCHEMA ${schema}`),
      );
    }
  });

  it('should migrate the database', async () => {
    await service.migrate();
    expect(migrate).toHaveBeenCalledWith(drizzleService.db, expect.anything());
  });

  it('should reset the database', async () => {
    await service.reset();
    expect(reset).toHaveBeenCalledWith(drizzleService.db, expect.anything());
  });

  it('should seed the database', async () => {
    await service.seed();
    expect(seed).toHaveBeenCalledWith(drizzleService.db, expect.anything());
  });
});
