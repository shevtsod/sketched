import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { DbCommand } from './db.command';

@Module({
  imports: [DbModule],
  providers: [...DbCommand.registerWithSubCommands()],
})
export class DbCliModule {}
