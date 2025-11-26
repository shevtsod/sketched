import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '../../db/db.module';
import { DbCommand } from './db.command';

@Module({
  imports: [ConfigModule, DbModule],
  providers: [...DbCommand.registerWithSubCommands()],
})
export class DbCliModule {}
