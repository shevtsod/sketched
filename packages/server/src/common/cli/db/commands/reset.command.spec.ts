import { Test } from '@nestjs/testing';
import { InquirerService } from 'nest-commander';
import { getLoggerToken } from 'nestjs-pino';
import { Mocked } from 'vitest';
import { mockPinoLogger } from '../../../config/__mocks__/pino-logger.mock';
import { mockDbManagementService } from '../../../db/__mocks__/db-management.service.mock';
import { DbManagementService } from '../../../db/db-management.service';
import { mockInquirerService } from '../../__mocks__/inquirer.service.mock';
import { ResetCommand } from './reset.command';

describe('ResetCommand', () => {
  let command: ResetCommand;
  let dbMgmtService: Mocked<DbManagementService>;
  let inquirerService: Mocked<InquirerService>;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        ResetCommand,
        {
          provide: getLoggerToken(ResetCommand.name),
          useValue: mockPinoLogger,
        },
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

    command = app.get(ResetCommand);
    dbMgmtService = app.get(DbManagementService);
    inquirerService = app.get(InquirerService);
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
    expect(dbMgmtService.reset).not.toHaveBeenCalled();
  });

  it('should run', async () => {
    await command.run([], { confirm: true });
    expect(dbMgmtService.reset).toHaveBeenCalled();
  });

  it('should throw when run fails', async () => {
    const error = new Error('Test Error');
    dbMgmtService.reset.mockImplementationOnce(() => {
      throw error;
    });
    await expect(command.run([], { confirm: true })).rejects.toThrow(error);
  });
});
