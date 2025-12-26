import {
  CommandRunner,
  InquirerService,
  Option,
  SubCommand,
} from 'nest-commander';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { DbManagementService } from '../../../db/db-management.service';

@SubCommand({
  name: 'drop',
  description: 'Removes all existing data and tables',
})
export class DropCommand extends CommandRunner {
  constructor(
    @InjectPinoLogger(DropCommand.name)
    private readonly logger: PinoLogger,
    private readonly dbMgmt: DbManagementService,
    private readonly inquirerService: InquirerService,
  ) {
    super();
  }

  @Option({
    name: 'confirm',
    flags: '-y, --yes',
    description: 'Confirm silently',
  })
  parseConfirm(val: boolean) {
    return val;
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

      await this.dbMgmt.drop();
    } catch (error) {
      this.logger.error({ error });
      throw error;
    }
  }
}
