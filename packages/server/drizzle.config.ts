import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from './src/config/env';

// https://orm.drizzle.team/docs/drizzle-config-file
export default defineConfig({
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
    ssl: !env.isDevOrTest,
  },
});
