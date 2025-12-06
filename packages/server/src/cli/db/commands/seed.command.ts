import { Logger } from '@nestjs/common';
import { DrizzleQueryError } from 'drizzle-orm';
import { CommandRunner, SubCommand } from 'nest-commander';
import { DbManagementService } from '../../../common/db/db-management.service';

@SubCommand({
  name: 'seed',
  description: 'Seeds the database with random data',
})
export class SeedCommand extends CommandRunner {
  private readonly logger = new Logger(SeedCommand.name);

  constructor(private readonly dbManagementService: DbManagementService) {
    super();
  }

  async run(
    _passedParams: string[],
    _options?: Record<string, any>,
  ): Promise<void> {
    try {
      await this.dbManagementService.seed();
    } catch (err) {
      if (err instanceof DrizzleQueryError) {
        this.logger.debug(err.message);
        this.logger.warn({
          msg: 'Failed seeding database, likely due to existing data. Run "npm run cli db reset" to remove existing data.',
          cause: err.cause?.message,
        });
      } else {
        this.logger.error({ err });
        throw err;
      }
    }
  }
}
