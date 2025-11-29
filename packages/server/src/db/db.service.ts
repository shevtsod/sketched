import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DrizzleConfig, sql } from 'drizzle-orm';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { reset, seed } from 'drizzle-seed';
import { Pool } from 'pg';
import { schema } from '.';

/** ORM type with schema definition */
export type DbType = NodePgDatabase<typeof schema>;

// https://orm.drizzle.team/docs/connect-overview
const config: DrizzleConfig<typeof schema> = {
  schema,
  casing: 'snake_case',
};

/**
 * Provides access to the SQL database for querying
 *
 * @see {@link https://orm.drizzle.team/docs/overview}
 */
@Injectable()
export class DbService implements OnModuleDestroy {
  private readonly logger = new Logger(DbService.name);

  private readonly pool: Pool;
  readonly db: DbType;

  constructor(private readonly configService: ConfigService) {
    // https://github.com/brianc/node-postgres
    this.pool = new Pool({
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      database: configService.get<string>('DB_NAME'),
      user: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASSWORD'),
      ssl: !configService.get<boolean>('isDevOrTest')!,
    });

    this.db = drizzle(this.pool, config);
  }

  // https://docs.nestjs.com/fundamentals/lifecycle-events
  async onModuleDestroy() {
    // Close database connection
    await this.pool.end();
  }

  /**
   * Drops all existing database tables and migrations
   */
  async drop(): Promise<void> {
    this.logger.log(`Dropping database ...`);

    for (const schema of ['public', 'drizzle']) {
      this.logger.log(`Dropping schema "${schema}" ...`);
      await this.db.execute(sql.raw(`DROP SCHEMA ${schema} CASCADE`));
      await this.db.execute(sql.raw(`CREATE SCHEMA ${schema}`));
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
    await migrate(this.db, { migrationsFolder: './drizzle' });
    this.logger.log(`Finished migrating database`);
  }

  /**
   * Removes existing data in database tables
   *
   * @see {@link https://orm.drizzle.team/docs/seed-overview#reset-database}
   */
  async reset(): Promise<void> {
    this.logger.log(`Resetting database ...`);
    await reset(this.db, schema);
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
    await seed(this.db, schema);
    this.logger.log('Finished seeding database');
  }
}
