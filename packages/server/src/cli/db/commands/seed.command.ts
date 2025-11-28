import { Logger } from '@nestjs/common';
import { DrizzleQueryError } from 'drizzle-orm';
import { seed } from 'drizzle-seed';
import { CommandRunner, SubCommand } from 'nest-commander';
import { schema } from '../../../db';
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

  async run(
    _passedParams: string[],
    _options?: Record<string, any>,
  ): Promise<void> {
    this.logger.log(`Seeding database ...`);

    try {
      // https://orm.drizzle.team/docs/seed-overview
      await seed(this.dbService.db, schema);
    } catch (err) {
      if (err instanceof DrizzleQueryError) {
        this.logger.debug({ message: err.message });
        this.logger.warn(
          { cause: err.cause?.message },
          'Error while seeding database, likely due to existing data. Run "npm run drizzle:reset" to remove existing data.',
        );
      } else {
        throw err;
      }
    }

    this.logger.log('Finished seeding database');
  }
}
