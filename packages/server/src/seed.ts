import { DrizzleQueryError } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { reset, seed } from 'drizzle-seed';
import { Pool } from 'pg';
import { drizzleConfig } from './config/db';
import { env } from './config/env';
import { logger } from './config/logger';
import * as schema from './db/schema';

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  ssl: !['development', 'test'].includes(env.NODE_ENV),
});

// https://orm.drizzle.team/docs/seed-overview

async function main() {
  const command = process.argv[2];
  const isSeedEnv = ['development', 'test'].includes(env.NODE_ENV);
  if (!isSeedEnv) return;

  const db = drizzle(pool, drizzleConfig);

  if (command === 'seed') {
    try {
      logger.info(`NODE_ENV="${env.NODE_ENV}", seeding database ...`);
      await seed(db, schema);
      logger.info('Finished seeding database!');
    } catch (err) {
      if (err instanceof DrizzleQueryError) {
        logger.warn(
          { message: err.message, cause: err.cause?.message },
          'Error while seeding database, likely due to existing data. Run "npm run drizzle:reset" to remove existing data.',
        );
      } else {
        throw err;
      }
    }
  } else if (command === 'reset') {
    logger.info(`NODE_ENV="${env.NODE_ENV}", resetting database ...`);
    await reset(db, schema);
    logger.info('Finished resetting database!');
  } else {
    throw new Error(`Unknown command ${command}`);
  }
}

main()
  .catch((err) => logger.error({ err }))
  .finally(() => pool.end());
