import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schema } from '.';
import { EnvSchemaType } from '../config/env';
import { DrizzleService } from './drizzle.service';

jest.mock('pg', () => {
  return {
    Pool: jest.fn(() => ({
      end: jest.fn(),
    })),
  };
});

jest.mock('drizzle-orm/node-postgres', () => ({
  drizzle: jest.fn().mockReturnValue('mockDrizzle'),
}));

const mockEnv: Partial<EnvSchemaType> = {
  DB_HOST: 'localhost',
  DB_PORT: 5432,
  DB_NAME: 'testdb',
  DB_USER: 'testuser',
  DB_PASSWORD: 'secret',
  isDevOrTest: false,
};

const mockConfigService = {
  get: jest.fn((key: string): string | undefined => mockEnv[key]),
};

describe('DrizzleService', () => {
  let service: DrizzleService;
  let configService: jest.Mocked<ConfigService>;
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
    configService = app.get<jest.Mocked<ConfigService>>(ConfigService);
    pool = (Pool as unknown as jest.Mock).mock.results[0].value;
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
