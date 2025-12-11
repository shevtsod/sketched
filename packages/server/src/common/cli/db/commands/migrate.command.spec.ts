import { Test } from '@nestjs/testing';
import { Mocked } from 'vitest';
import { mockDbManagementService } from '../../../db/__mocks__/db-management.service';
import { DbManagementService } from '../../../db/db-management.service';
import { MigrateCommand } from './migrate.command';

describe('MigrateCommand', () => {
  let command: MigrateCommand;
  let dbManagementService: Mocked<DbManagementService>;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        MigrateCommand,
        {
          provide: DbManagementService,
          useValue: mockDbManagementService,
        },
      ],
    }).compile();

    command = app.get(MigrateCommand);
    dbManagementService =
      app.get<Mocked<DbManagementService>>(DbManagementService);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  it('should run', async () => {
    await command.run([]);
    expect(dbManagementService.migrate).toHaveBeenCalled();
  });

  it('should throw when run fails', async () => {
    const error = new Error('Test Error');
    dbManagementService.migrate.mockImplementationOnce(() => {
      throw error;
    });
    await expect(command.run([])).rejects.toThrow(error);
  });
});
