import { Logger } from '@nestjs/common';
import { CommandRunner, SubCommand } from 'nest-commander';
import { DbService } from '../../../db/db.service';

@SubCommand({
  name: 'reset',
  description: 'Removes all existing data in all tables',
})
export class ResetCommand extends CommandRunner {
  private readonly logger = new Logger(ResetCommand.name);

  constructor(private readonly dbService: DbService) {
    super();
  }

  run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    this.logger.log(passedParams, options);
    return Promise.resolve();
  }
}
