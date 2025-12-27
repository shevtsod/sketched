import { Test } from '@nestjs/testing';
import { execa } from 'execa';
import { getLoggerToken } from 'nestjs-pino';
import { Mocked } from 'vitest';
import { mockPinoLogger } from '../config/__mocks__/pino-logger.mock';
import { createMockPrismaService } from './__mocks__/prisma.service.mock';
import { DbManagementService } from './db-management.service';
import { PrismaService } from './prisma.service';

vi.mock('execa', () => ({
  execa: vi.fn(() => ({
    stdout: '',
  })),
}));

describe('DbManagementService', async () => {
  const mockPrismaService = await createMockPrismaService();

  let service: DbManagementService;
  let prismaService: Mocked<PrismaService>;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        DbManagementService,
        {
          provide: getLoggerToken(DbManagementService.name),
          useValue: mockPinoLogger,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = app.get(DbManagementService);
    prismaService = app.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should drop the database', async () => {
    await service.drop();
    expect(mockPrismaService.$executeRawUnsafe).toHaveBeenCalledTimes(2);
  });

  it('should migrate the database', async () => {
    await service.migrate();
    expect(execa).toHaveBeenCalledWith(['npm run prisma migrate deploy']);
  });

  it('should reset the database', async () => {
    await service.reset();
    expect(execa).toHaveBeenCalledWith([
      'npm run -- prisma migrate reset --force',
    ]);
  });

  it('should seed the database', async () => {
    await service.seed();
    expect(execa).toHaveBeenCalledWith(['npm run prisma db seed']);
  });
});
