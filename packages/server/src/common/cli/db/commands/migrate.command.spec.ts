import { Test } from '@nestjs/testing';
import { Mocked } from 'vitest';
import { mockDbManagementService } from '../../../db/__mocks__/db-management.service.mock';
import { DbManagementService } from '../../../db/db-management.service';
import { MigrateCommand } from './migrate.command';

describe('MigrateCommand', () => {
  let command: MigrateCommand;
  let dbMgmtService: Mocked<DbManagementService>;

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
    dbMgmtService = app.get<Mocked<DbManagementService>>(DbManagementService);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  it('should run', async () => {
    await command.run([]);
    expect(dbMgmtService.migrate).toHaveBeenCalled();
  });

  it('should throw when run fails', async () => {
    const error = new Error('Test Error');
    dbMgmtService.migrate.mockImplementationOnce(() => {
      throw error;
    });
    await expect(command.run([])).rejects.toThrow(error);
  });
});
