import { Config } from 'drizzle-kit';
import { DrizzleConfig } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { env } from './env';

/** ORM type with schema definition */
export type DbType = NodePgDatabase<typeof schema>;

// https://orm.drizzle.team/docs/drizzle-config-file
export const config: Config = {
  out: './drizzle',
  schema: './src/db/schema',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    ssl: !['development', 'test'].includes(env.NODE_ENV),
  },
};

// https://orm.drizzle.team/docs/connect-overview
export const drizzleConfig: DrizzleConfig<typeof schema> = {
  schema,
  casing: 'snake_case',
};
