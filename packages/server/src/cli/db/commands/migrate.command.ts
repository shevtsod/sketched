import { Logger } from '@nestjs/common';
import { CommandRunner, SubCommand } from 'nest-commander';
import { DbService } from '../../../db/db.service';

@SubCommand({
  name: 'migrate',
  description: 'Applies database migrations',
})
export class MigrateCommand extends CommandRunner {
  private readonly logger = new Logger(MigrateCommand.name);

  constructor(private readonly dbService: DbService) {
    super();
  }

  async run(
    _passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    try {
      await this.dbService.migrate();
    } catch (err) {
      this.logger.error({ err });
      throw err;
    }
  }
}
