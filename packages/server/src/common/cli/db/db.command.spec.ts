import { Test } from '@nestjs/testing';
import { DbCommand } from './db.command';

const mockCommand = {
  help: vi.fn(),
};

describe('DbCommand', () => {
  let command: DbCommand;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [DbCommand],
    }).compile();

    command = app.get(DbCommand);
    command.setCommand(
      mockCommand as unknown as Parameters<typeof command.setCommand>[0],
    );
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  it('should run', async () => {
    await command.run();
    expect(mockCommand.help).toHaveBeenCalled();
  });
});
