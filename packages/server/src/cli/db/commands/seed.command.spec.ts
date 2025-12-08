import { Test } from '@nestjs/testing';
import { DrizzleQueryError } from 'drizzle-orm';
import { Mocked } from 'vitest';
import { mockDbManagementService } from '../../../common/db/__mocks__/db-management.service';
import { DbManagementService } from '../../../common/db/db-management.service';
import { SeedCommand } from './seed.command';

describe('SeedCommand', () => {
  let command: SeedCommand;
  let dbManagementService: Mocked<DbManagementService>;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        SeedCommand,
        {
          provide: DbManagementService,
          useValue: mockDbManagementService,
        },
      ],
    }).compile();

    command = app.get(SeedCommand);
    dbManagementService =
      app.get<Mocked<DbManagementService>>(DbManagementService);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  it('should run', async () => {
    await command.run([]);
    expect(dbManagementService.seed).toHaveBeenCalled();
  });

  it('should handle DrizzleQueryError when run fails', async () => {
    const error = new DrizzleQueryError('Test Error', []);
    dbManagementService.seed.mockImplementationOnce(() => {
      throw error;
    });
    await expect(command.run([])).resolves.toBeUndefined();
  });

  it('should throw when run fails', async () => {
    const error = new Error('Test Error');
    dbManagementService.seed.mockImplementationOnce(() => {
      throw error;
    });
    await expect(command.run([])).rejects.toThrow(error);
  });
});
