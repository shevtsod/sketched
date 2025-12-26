import { Test } from '@nestjs/testing';
import { getLoggerToken } from 'nestjs-pino';
import { Mocked } from 'vitest';
import { mockPinoLogger } from '../../../config/__mocks__/pino-logger.mock';
import { mockDbManagementService } from '../../../db/__mocks__/db-management.service.mock';
import { DbManagementService } from '../../../db/db-management.service';
import { SeedCommand } from './seed.command';

describe('SeedCommand', () => {
  let command: SeedCommand;
  let dbManagementService: Mocked<DbManagementService>;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        SeedCommand,

        {
          provide: getLoggerToken(SeedCommand.name),
          useValue: mockPinoLogger,
        },
        {
          provide: DbManagementService,
          useValue: mockDbManagementService,
        },
      ],
    }).compile();

    command = app.get(SeedCommand);
    dbManagementService = app.get(DbManagementService);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  it('should run', async () => {
    await command.run([]);
    expect(dbManagementService.seed).toHaveBeenCalled();
  });

  it('should throw when run fails', async () => {
    const error = new Error('Test Error');
    dbManagementService.seed.mockImplementationOnce(() => {
      throw error;
    });
    await expect(command.run([])).rejects.toThrow(error);
  });
});
