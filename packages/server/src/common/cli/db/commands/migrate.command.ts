import { Logger } from '@nestjs/common';
import { CommandRunner, SubCommand } from 'nest-commander';
import { DbManagementService } from '../../../db/db-management.service';

@SubCommand({
  name: 'migrate',
  description: 'Applies database migrations',
})
export class MigrateCommand extends CommandRunner {
  private readonly logger = new Logger(MigrateCommand.name);

  constructor(private readonly dbMgmt: DbManagementService) {
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
