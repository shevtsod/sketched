import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PrismaPg } from '@prisma/adapter-pg';
import { Mock, Mocked } from 'vitest';
import { createMockConfigService } from '../config/__mocks__/config.service.mock.js';
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

const mockEnv: Partial<EnvSchemaType> = {
  DATABASE_URL: 'test',
};

const mockConfigService = createMockConfigService(mockEnv);

describe('PrismaService', () => {
  let service: PrismaService;
  let configService: Mocked<ConfigService>;
  let prismaPg: Mocked<PrismaPg>;
  let prismaClient: Mocked<PrismaClient>;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = app.get(PrismaService);
    configService = app.get<Mocked<ConfigService>>(ConfigService);
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

    expect(prismaClient.$on).toHaveBeenCalled();
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
