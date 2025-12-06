import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbManagementService } from './db-management.service';
import { DbService } from './db.service';
import { DrizzleService } from './drizzle.service';

@Module({
  imports: [ConfigModule],
  providers: [DrizzleService, DbManagementService, DbService],
  exports: [DbManagementService, DbService],
})
export class DbModule {}
