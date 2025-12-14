import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbManagementService } from './db-management.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService, DbManagementService],
  exports: [PrismaService, DbManagementService],
})
export class DbModule {}
