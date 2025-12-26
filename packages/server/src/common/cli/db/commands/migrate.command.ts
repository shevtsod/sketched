import { CommandRunner, SubCommand } from 'nest-commander';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { DbManagementService } from '../../../db/db-management.service';

@SubCommand({
  name: 'migrate',
  description: 'Applies database migrations',
})
export class MigrateCommand extends CommandRunner {
  constructor(
    @InjectPinoLogger(MigrateCommand.name)
    private readonly logger: PinoLogger,
    private readonly dbMgmt: DbManagementService,
  ) {
    super();
  }

  async run(
    _passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    try {
      await this.dbMgmt.migrate();
    } catch (error) {
      this.logger.error({ error });
      throw error;
    }
  }
}
