import { Injectable, Logger } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { reset, seed } from 'drizzle-seed';
import { schema } from '.';
import { DrizzleService } from './drizzle.service';

@Injectable()
export class DbManagementService {
  private readonly logger = new Logger(DbManagementService.name);

  constructor(private drizzle: DrizzleService) {}

  /**
   * Drops all existing database tables and migrations
   */
  async drop(): Promise<void> {
    this.logger.log(`Dropping database ...`);

    for (const schema of ['public', 'drizzle']) {
      this.logger.log(`Dropping schema "${schema}" ...`);
      await this.drizzle.db.execute(sql.raw(`DROP SCHEMA ${schema} CASCADE`));
      await this.drizzle.db.execute(sql.raw(`CREATE SCHEMA ${schema}`));
    }

    this.logger.log('Finished dropping database');
  }

  /**
   * Runs database migrations
   *
   * @see {@link https://orm.drizzle.team/docs/migrations}
   */
  async migrate(): Promise<void> {
    this.logger.log(`Migrating database ...`);
    await migrate(this.drizzle.db, { migrationsFolder: './drizzle' });
    this.logger.log(`Finished migrating database`);
  }

  /**
   * Removes existing data in database tables
   *
   * @see {@link https://orm.drizzle.team/docs/seed-overview#reset-database}
   */
  async reset(): Promise<void> {
    this.logger.log(`Resetting database ...`);
    await reset(this.drizzle.db, schema);
    this.logger.log('Finished resetting database');
  }

  /**
   * Seeds the database with dummy records
   *
   * @see {@link https://orm.drizzle.team/docs/seed-overview}
   */
  async seed(): Promise<void> {
    this.logger.log(`Seeding database ...`);

    // https://orm.drizzle.team/docs/seed-overview
    await seed(this.drizzle.db, schema).refine(() => ({
      users: {
        with: {
          accounts: 3,
        },
      },
    }));

    this.logger.log('Finished seeding database');
  }
}
