import { CommandRunner, SubCommand } from 'nest-commander';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { DbManagementService } from '../../../db/db-management.service';

@SubCommand({
  name: 'seed',
  description: 'Seeds the database with random data',
})
export class SeedCommand extends CommandRunner {
  constructor(
    @InjectPinoLogger(SeedCommand.name)
    private readonly logger: PinoLogger,
    private readonly dbMgmt: DbManagementService,
  ) {
    super();
  }

  async run(
    _passedParams: string[],
    _options?: Record<string, any>,
  ): Promise<void> {
    try {
      await this.dbMgmt.seed();
    } catch (error) {
      this.logger.error({ error });
      throw error;
    }
  }
}
