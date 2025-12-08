import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Mock, Mocked } from 'vitest';
import { schema } from '.';
import { createMockConfigService } from '../config/__mocks__/config.service.mock';
import { EnvSchemaType } from '../config/env';
import { DrizzleService } from './drizzle.service';

vi.mock('pg', () => ({
  Pool: vi.fn(
    class {
      end = vi.fn();
    },
  ),
}));

vi.mock('drizzle-orm/node-postgres', () => ({
  drizzle: vi.fn().mockReturnValue('mockDrizzle'),
}));

const mockEnv: Partial<EnvSchemaType> = {
  DB_HOST: 'localhost',
  DB_PORT: 5432,
  DB_NAME: 'testdb',
  DB_USER: 'testuser',
  DB_PASSWORD: 'secret',
  isDevOrTest: false,
};

const mockConfigService = createMockConfigService(mockEnv);

describe('DrizzleService', () => {
  let service: DrizzleService;
  let configService: Mocked<ConfigService>;
  let pool: Pool;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        DrizzleService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = app.get(DrizzleService);
    configService = app.get<Mocked<ConfigService>>(ConfigService);
    pool = (Pool as unknown as Mock).mock.results[0].value;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a drizzle instance', () => {
    expect(Pool).toHaveBeenCalledWith(
      expect.objectContaining({
        host: mockEnv.DB_HOST,
        port: mockEnv.DB_PORT,
        database: mockEnv.DB_NAME,
        user: mockEnv.DB_USER,
        password: mockEnv.DB_PASSWORD,
        ssl: true,
      }),
    );

    expect(drizzle).toHaveBeenCalledWith(
      pool,
      expect.objectContaining({ schema }),
    );

    expect(service.db).toBe('mockDrizzle');
  });

  it('should disable ssl in development', () => {
    configService.get.mockImplementation((key: string) => {
      if (key === 'isDevOrTest') return true;
      return mockEnv[key];
    });

    service = new DrizzleService(configService);

    expect(Pool).toHaveBeenCalledWith(expect.objectContaining({ ssl: false }));
  });

  it('should end pool connection on module destroy', async () => {
    await service.onModuleDestroy();
    expect(pool.end).toHaveBeenCalledTimes(1);
  });
});
