import { Injectable } from '@nestjs/common';
import { execa } from 'execa';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { PrismaService } from './prisma.service';

@Injectable()
export class DbManagementService {
  constructor(
    @InjectPinoLogger(DbManagementService.name)
    private readonly logger: PinoLogger,
    private prisma: PrismaService,
  ) {}

  /**
   * Drops all existing database tables and migrations
   */
  async drop(): Promise<void> {
    this.logger.info(`Dropping database ...`);

    const schema = 'public';
    await this.prisma.$executeRawUnsafe(`DROP SCHEMA ${schema} CASCADE`);
    await this.prisma.$executeRawUnsafe(`CREATE SCHEMA ${schema}`);

    this.logger.info('Finished dropping database');
  }

  /**
   * Runs database migrations
   */
  async migrate(): Promise<void> {
    this.logger.info(`Migrating database ...`);

    const { stdout } = await execa`npm run prisma migrate`;
    this.logger.info(stdout);

    this.logger.info(`Finished migrating database`);
  }

  /**
   * Removes existing data in database tables
   */
  async reset(): Promise<void> {
    this.logger.info(`Resetting database ...`);

    const { stdout } = await execa`npm run -- prisma migrate reset --force`;
    this.logger.info(stdout);

    this.logger.info('Finished resetting database');
  }

  /**
   * Seeds the database with dummy records
   */
  async seed(): Promise<void> {
    this.logger.info(`Seeding database ...`);

    const { stdout } = await execa`npm run prisma db seed`;
    this.logger.info(stdout);

    this.logger.info('Finished seeding database');
  }
}
