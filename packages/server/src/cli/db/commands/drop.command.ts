import { Logger } from '@nestjs/common';
import {
  CommandRunner,
  InquirerService,
  Option,
  SubCommand,
} from 'nest-commander';
import { DbService } from '../../../db/db.service';

@SubCommand({
  name: 'drop',
  description: 'Removes all existing data and tables',
})
export class DropCommand extends CommandRunner {
  private readonly logger = new Logger(DropCommand.name);

  constructor(
    private readonly dbService: DbService,
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

      await this.dbService.drop();
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
