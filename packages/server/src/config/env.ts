import z from 'zod';

// https://zod.dev/
const EnvSchema = z.object({
  VERSION: z.string().default('0.0.0'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  LOG_LEVEL: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])
    .default('info'),
  HOST: z.string().default('127.0.0.1'),
  PORT: z.coerce.number().default(3000),
  BASE_PATH: z.string().default(''),
  SECRET: z.string().default('change-me'),

  DB_HOST: z.string().default('127.0.0.1'),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string().default('sketched'),
  DB_USER: z.string().default('sketched'),
  DB_PASSWORD: z.string().default('change-me'),

  CACHE_HOST: z.string().default('127.0.0.1'),
  CACHE_PORT: z.coerce.number().default(6379),
  CACHE_USER: z.string().default('sketched'),
  CACHE_PASSWORD: z.string().default('change-me'),
});

type EnvSchemaType = z.infer<typeof EnvSchema>;

export function validate(input: unknown): EnvSchemaType {
  return EnvSchema.parse(input);
}

export const env = validate(process.env);
