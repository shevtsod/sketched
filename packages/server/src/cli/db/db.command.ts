import { Command, CommandRunner } from 'nest-commander';
import { DropCommand } from './commands/drop.command';
import { MigrateCommand } from './commands/migrate.command';
import { ResetCommand } from './commands/reset.command';
import { SeedCommand } from './commands/seed.command';

@Command({
  name: 'db',
  description: 'Database-related commands',
  subCommands: [DropCommand, MigrateCommand, ResetCommand, SeedCommand],
})
export class DbCommand extends CommandRunner {
  run(): Promise<void> {
    this.command.help();
  }
}
