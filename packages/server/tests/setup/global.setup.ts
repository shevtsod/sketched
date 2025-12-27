import { MinioContainer } from '@testcontainers/minio';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { ValkeyContainer } from '@testcontainers/valkey';
import { execa } from 'execa';
import { env } from '../../src/common/config/env';
import { createLogger } from '../../src/common/config/logger';

const logger = createLogger();

export async function setup() {
  logger.info('Running global setup ...');

  // Run test containers required for tests
  // https://node.testcontainers.org/quickstart/usage/
  const postgres = await new PostgreSqlContainer('postgres:18-alpine')
    .withHostname('db')
    .withExposedPorts(env.DB_PORT)
    .withDatabase(env.DB_NAME)
    .withUsername(env.DB_USER)
    .withPassword(env.DB_PASSWORD)
    .start();

  process.env.DB_PORT = `${postgres.getMappedPort(env.DB_PORT)}`;

  const valkey = await new ValkeyContainer('valkey/valkey:9-alpine')
    .withHostname('cache')
    .withExposedPorts(env.CACHE_PORT)
    .withUsername(env.CACHE_USER)
    .withPassword(env.CACHE_PASSWORD)
    .start();

  process.env.CACHE_PORT = `${valkey.getMappedPort(env.CACHE_PORT)}`;

  const minio = await new MinioContainer(
    'minio/minio:RELEASE.2025-09-07T16-13-09Z',
  )
    .withHostname('objects')
    .withExposedPorts(9000)
    .withUsername(env.STORAGE_ACCESS_KEY_ID)
    .withPassword(env.STORAGE_SECRET_ACCESS_KEY)
    .start();

  process.env.STORAGE_ENDPOINT = `http://127.0.0.1:${minio.getMappedPort(9000)}`;

  logger.info('Migrating and seeding database ...');
  await execa`npm run cli db migrate`;
  await execa`npm run cli db seed`;
}

export async function teardown() {
  logger.info('Running global teardown ...');

  // testcontainers automatically tears down test containers
  // https://node.testcontainers.org/quickstart/usage/
}
