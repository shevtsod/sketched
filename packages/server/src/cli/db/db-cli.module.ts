import { Module } from '@nestjs/common';
import { DbModule } from '../../common/db/db.module';
import { DbCommand } from './db.command';

@Module({
  imports: [DbModule],
  providers: [...DbCommand.registerWithSubCommands()],
})
export class DbCliModule {}
