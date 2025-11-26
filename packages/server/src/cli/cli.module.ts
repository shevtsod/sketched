import { Module } from '@nestjs/common';
import { DbCliModule } from './db/db-cli.module';

/** List of commands to include in CLI */
const cliModules = [DbCliModule];

@Module({
  imports: [...cliModules],
  exports: [...cliModules],
})
export class CliModule {}
