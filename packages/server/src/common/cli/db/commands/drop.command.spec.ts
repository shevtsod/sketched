import { Test } from '@nestjs/testing';
import { InquirerService } from 'nest-commander';
import { Mocked } from 'vitest';
import { mockDbManagementService } from '../../../db/__mocks__/db-management.service';
import { DbManagementService } from '../../../db/db-management.service';
import { mockInquirerService } from '../../__mocks__/inquirer.service.mock';
import { DropCommand } from './drop.command';

describe('DropCommand', () => {
  let command: DropCommand;
  let dbManagementService: Mocked<DbManagementService>;
  let inquirerService: Mocked<InquirerService>;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        DropCommand,
        {
          provide: DbManagementService,
          useValue: mockDbManagementService,
        },
        {
          provide: InquirerService,
          useValue: mockInquirerService,
        },
      ],
    }).compile();

    command = app.get(DropCommand);
    dbManagementService =
      app.get<Mocked<DbManagementService>>(DbManagementService);
    inquirerService = app.get<Mocked<InquirerService>>(InquirerService);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  it('should parse confirm', () => {
    expect(command.parseConfirm(true)).toBe(true);
    expect(command.parseConfirm(false)).toBe(false);
  });

  it('should not run without confirm', async () => {
    inquirerService.ask.mockResolvedValueOnce({ confirm: false });
    await expect(command.run([], { confirm: false })).rejects.toThrow();
    expect(dbManagementService.drop).not.toHaveBeenCalled();
  });

  it('should run', async () => {
    await command.run([], { confirm: true });
    expect(dbManagementService.drop).toHaveBeenCalled();
  });

  it('should throw when run fails', async () => {
    const error = new Error('Test Error');
    dbManagementService.drop.mockImplementationOnce(() => {
      throw error;
    });
    await expect(command.run([], { confirm: true })).rejects.toThrow(error);
  });
});
