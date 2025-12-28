import z from 'zod';

// https://zod.dev/
const EnvSchema = z
  .object({
    /** Application version to run */
    VERSION: z.string().default('0.0.0'),
    /** Application environment */
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    /** Application log level */
    LOG_LEVEL: z
      .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
      .optional(),
    /** Server hostname or IP address */
    HOST: z.string().default('127.0.0.1'),
    /** Server port */
    PORT: z.coerce.number().default(3000),
    /** Serve app under a subpath */
    BASE_PATH: z.string().default(''),
    /** Secret for hashing and signing keys, passwords, etc. */
    SECRET: z.string().default('change-me'),
    /** Default admin username */
    ADMIN_USERNAME: z.string().default('admin'),
    /** Default admin user email address */
    ADMIN_EMAIL: z.string().default('root@localhost'),
    /** Default admin user password */
    ADMIN_PASSWORD: z.string().default('change-me'),

    /** Database hostname or IP address */
    DB_HOST: z.string().default('127.0.0.1'),
    /** Database port */
    DB_PORT: z.coerce.number().default(5432),
    /** Database name */
    DB_NAME: z.string().default('sketched'),
    /** Database user */
    DB_USER: z.string().default('sketched'),
    /** Database password */
    DB_PASSWORD: z.string().default('change-me'),

    /** Cache hostname or IP address */
    CACHE_HOST: z.string().default('127.0.0.1'),
    /** Cache port */
    CACHE_PORT: z.coerce.number().default(6379),
    /** Cache user */
    CACHE_USER: z.string().default('sketched'),
    /** Cache password */
    CACHE_PASSWORD: z.string().default('change-me'),

    /** Storage base URL */
    STORAGE_ENDPOINT: z.string().default('http://127.0.0.1:9000'),
    /** Region where bucket is hosted */
    STORAGE_REGION: z.string().default('us-east-1'),
    /** Storage access key ID */
    STORAGE_ACCESS_KEY_ID: z.string().default('sketched'),
    /** Storage secret access key */
    STORAGE_SECRET_ACCESS_KEY: z.string().default('change-me'),
    /** Storage bucket name */
    STORAGE_BUCKET: z.string().default('sketched'),
    /** Expiration time for signed URLs, in seconds */
    STORAGE_URL_EXPIRATION: z.coerce.number().default(3600),
  })
  // Set computed values
  .transform((val) => ({
    ...val,

    // Set a default log level based on NODE_ENV
    LOG_LEVEL:
      val.LOG_LEVEL ??
      (val.NODE_ENV === 'development'
        ? 'debug'
        : val.NODE_ENV === 'test'
          ? 'warn'
          : 'info'),

    /** True if environment in ["development", "test"] */
    isDevOrTest: ['development', 'test'].includes(val.NODE_ENV),

    /** Merge database credentials */
    DATABASE_URL: `postgresql://${val.DB_USER}:${val.DB_PASSWORD}@${val.DB_HOST}:${val.DB_PORT}/${val.DB_NAME}`,
  }));

export type EnvSchemaType = z.infer<typeof EnvSchema>;

/**
 * Get environment variables with defaults
 *
 * @param input optional input object containing raw environment variable values
 * @returns environment variables with defaults
 */
export function getEnv(input: unknown = process.env): EnvSchemaType {
  return EnvSchema.parse(input);
}

export const env = getEnv(process.env);
