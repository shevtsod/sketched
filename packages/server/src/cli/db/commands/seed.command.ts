import { Logger } from '@nestjs/common';
import { CommandRunner, SubCommand } from 'nest-commander';
import { DbService } from '../../../db/db.service';

@SubCommand({
  name: 'seed',
  description: 'Seeds the database with random data',
})
export class SeedCommand extends CommandRunner {
  private readonly logger = new Logger(SeedCommand.name);

  constructor(private readonly dbService: DbService) {
    super();
  }

  run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    this.logger.log(passedParams, options);
    return Promise.resolve();
  }
}
