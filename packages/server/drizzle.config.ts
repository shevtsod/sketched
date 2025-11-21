import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { config } from './src/config/db';

export default defineConfig(config);
