import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PrismaPg } from '@prisma/adapter-pg';
import { getLoggerToken } from 'nestjs-pino';
import { Mock, Mocked } from 'vitest';
import { createMockConfigService } from '../config/__mocks__/config.service.mock.js';
import { mockPinoLogger } from '../config/__mocks__/pino-logger.mock.js';
import { EnvSchemaType } from '../config/env.js';
import { PrismaClient } from './generated/prisma/client';
import { PrismaService } from './prisma.service';

vi.mock('@prisma/adapter-pg', () => ({
  PrismaPg: vi.fn(class {}),
}));

vi.mock('./generated/prisma/client', () => ({
  PrismaClient: vi.fn(
    class {
      $connect = vi.fn();
      $disconnect = vi.fn();
      $on = vi.fn();
    },
  ),
}));

describe('PrismaService', () => {
  const mockEnv: Partial<EnvSchemaType> = {
    DATABASE_URL: faker.internet.url(),
  };

  const mockConfigService = createMockConfigService(mockEnv);

  let service: PrismaService;
  let configService: Mocked<ConfigService>;
  let prismaPg: Mocked<PrismaPg>;
  let prismaClient: Mocked<PrismaClient>;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: getLoggerToken(PrismaService.name),
          useValue: mockPinoLogger,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = app.get(PrismaService);
    configService = app.get(ConfigService);
    prismaPg = (PrismaPg as Mock).mock.results[0].value;
    prismaClient = (PrismaClient as Mock).mock.results[0].value;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a PrismaClient instance', () => {
    expect(PrismaPg).toHaveBeenCalledWith(
      expect.objectContaining({
        connectionString: mockEnv.DATABASE_URL,
      }),
    );
    expect(PrismaClient).toHaveBeenCalledWith(
      expect.objectContaining({
        adapter: prismaPg,
        log: expect.arrayContaining([
          expect.objectContaining({
            emit: expect.any(String),
            level: expect.any(String),
          }),
        ]),
      }),
    );

    expect(prismaClient.$on).toHaveBeenCalledWith(
      'query',
      expect.any(Function),
    );
    expect(prismaClient.$on).toHaveBeenCalledWith('info', expect.any(Function));
    expect(prismaClient.$on).toHaveBeenCalledWith('warn', expect.any(Function));
    expect(prismaClient.$on).toHaveBeenCalledWith(
      'error',
      expect.any(Function),
    );
  });

  it('should connect', async () => {
    await service.onModuleInit();
    expect(prismaClient.$connect).toHaveBeenCalledTimes(1);
  });

  it('should disconnect', async () => {
    await service.onModuleDestroy();
    expect(prismaClient.$disconnect).toHaveBeenCalledTimes(1);
  });
});
