import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DbService } from './db.service';
import * as schema from './schema';

jest.mock('pg');
jest.mock('drizzle-orm/node-postgres', () => ({
  drizzle: jest.fn().mockReturnValue('mockDrizzle'),
}));

const mockEnv = {
  NODE_ENV: 'production',
  DB_HOST: 'localhost',
  DB_PORT: 5432,
  DB_NAME: 'testdb',
  DB_USER: 'testuser',
  DB_PASSWORD: 'secret',
};

const mockConfigService = {
  get: jest
    .fn()
    .mockImplementation((key: string): string | undefined => mockEnv[key]),
};

describe('DbService', () => {
  let dbService: DbService;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        DbService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    dbService = app.get<DbService>(DbService);
    configService = app.get<jest.Mocked<ConfigService>>(ConfigService);
  });

  it('should create a drizzle instance', () => {
    expect(Pool).toHaveBeenCalledWith({
      host: mockEnv.DB_HOST,
      port: mockEnv.DB_PORT,
      database: mockEnv.DB_NAME,
      user: mockEnv.DB_USER,
      password: mockEnv.DB_PASSWORD,
      ssl: true,
    });

    expect(drizzle).toHaveBeenCalledWith(
      expect.any(Pool),
      expect.objectContaining({ schema }),
    );

    expect(dbService.db).toBe('mockDrizzle');
  });

  it('should disable ssl in development', () => {
    configService.get.mockImplementation((key: string) => {
      if (key === 'NODE_ENV') return 'development';
      return mockEnv[key];
    });

    dbService = new DbService(configService);

    expect(Pool).toHaveBeenCalledWith(expect.objectContaining({ ssl: false }));
  });
});
