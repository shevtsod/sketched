import { Injectable, Logger } from '@nestjs/common';
import { execa } from 'execa';
import { PrismaService } from './prisma.service';

@Injectable()
export class DbManagementService {
  private readonly logger = new Logger(DbManagementService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Drops all existing database tables and migrations
   */
  async drop(): Promise<void> {
    this.logger.log(`Dropping database ...`);

    const schema = 'public';
    await this.prisma.$executeRawUnsafe(`DROP SCHEMA ${schema} CASCADE`);
    await this.prisma.$executeRawUnsafe(`CREATE SCHEMA ${schema}`);

    this.logger.log('Finished dropping database');
  }

  /**
   * Runs database migrations
   */
  async migrate(): Promise<void> {
    this.logger.log(`Migrating database ...`);

    const { stdout } = await execa`npm run prisma migrate`;
    this.logger.log(stdout);

    this.logger.log(`Finished migrating database`);
  }

  /**
   * Removes existing data in database tables
   */
  async reset(): Promise<void> {
    this.logger.log(`Resetting database ...`);

    const { stdout } = await execa`npm run prisma migrate reset`;
    this.logger.log(stdout);

    this.logger.log('Finished resetting database');
  }

  /**
   * Seeds the database with dummy records
   */
  async seed(): Promise<void> {
    this.logger.log(`Seeding database ...`);

    const { stdout } = await execa`npm run prisma db seed`;
    this.logger.log(stdout);

    this.logger.log('Finished seeding database');
  }
}
