import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schema } from '.';
import { EnvSchemaType } from '../config/env';
import { DbService } from './db.service';

jest.mock('pg');
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
  get: jest
    .fn()
    .mockImplementation((key: string): string | undefined => mockEnv[key]),
};

describe('DbService', () => {
  let service: DbService;
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

    service = app.get<DbService>(DbService);
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

    expect(service.db).toBe('mockDrizzle');
  });

  it('should disable ssl in development', () => {
    configService.get.mockImplementation((key: string) => {
      if (key === 'isDevOrTest') return true;
      return mockEnv[key];
    });

    service = new DbService(configService);

    expect(Pool).toHaveBeenCalledWith(expect.objectContaining({ ssl: false }));
  });
});
