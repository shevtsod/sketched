import { Command, CommandRunner } from 'nest-commander';
import { ResetCommand } from './commands/reset.command';
import { SeedCommand } from './commands/seed.command';

@Command({
  name: 'db',
  description: 'Database-related commands',
  subCommands: [ResetCommand, SeedCommand],
})
export class DbCommand extends CommandRunner {
  run(): Promise<void> {
    this.command.help();
  }
}
