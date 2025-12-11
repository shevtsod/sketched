import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { CliModule } from './cli.module';

describe('CliModule', () => {
  let command: TestingModule;

  beforeEach(async () => {
    command = await CommandTestFactory.createTestingCommand({
      imports: [CliModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
