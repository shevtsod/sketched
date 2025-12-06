import { Logger } from '@nestjs/common';
import {
  CommandRunner,
  InquirerService,
  Option,
  SubCommand,
} from 'nest-commander';
import { DbManagementService } from '../../../common/db/db-management.service';

@SubCommand({
  name: 'reset',
  description: 'Removes all existing data in all tables',
})
export class ResetCommand extends CommandRunner {
  private readonly logger = new Logger(ResetCommand.name);

  constructor(
    private readonly dbManagementService: DbManagementService,
    private readonly inquirerService: InquirerService,
  ) {
    super();
  }

  async run(
    _passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    try {
      let confirm = options?.confirm;

      if (!confirm) {
        confirm = (
          await this.inquirerService.ask<{ confirm: boolean }>(
            'confirm-questions',
            undefined,
          )
        ).confirm;
      }

      if (!confirm) {
        throw new Error('Cancelled');
      }

      await this.dbManagementService.reset();
    } catch (err) {
      this.logger.error({ err });
      throw err;
    }
  }

  @Option({
    name: 'confirm',
    flags: '-y, --yes',
    description: 'Confirm silently',
  })
  parseShell(val: string) {
    return val;
  }
}
