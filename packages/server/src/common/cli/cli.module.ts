import { Module } from '@nestjs/common';
import { DbCliModule } from './db/db-cli.module';
import { QuestionSetsModule } from './question-sets/question-sets.module';

/** List of commands to include in CLI */
const cliModules = [DbCliModule];

@Module({
  imports: [QuestionSetsModule, ...cliModules],
})
export class CliModule {}
