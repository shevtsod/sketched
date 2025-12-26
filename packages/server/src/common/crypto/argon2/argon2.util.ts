import argon2 from 'argon2';
import { env } from '../../config/env';

type Argon2Options = Omit<
  argon2.Options & {
    raw?: boolean;
  },
  'secret'
>;

// https://github.com/ranisalt/node-argon2/wiki/Options
const defaultOptions: Argon2Options = {
  hashLength: 32,
  timeCost: 3,
  memoryCost: 65536,
  parallelism: 4,
  type: argon2.argon2id,
};

const defaultSecret = Buffer.from(env.SECRET);

/**
 * Hashes a password using Argon2
 *
 * @param password plaintext password to hash
 * @param secret secret (pepper) to use for hashing
 * @param options argon2 options
 * @returns hashed password
 */
export async function hash(
  password: Buffer | string,
  secret?: Buffer<ArrayBufferLike>,
  options?: Argon2Options,
): Promise<string> {
  return argon2.hash(password, {
    ...defaultOptions,
    ...options,
    secret: secret || defaultSecret,
  });
}

/**
 * Verifies a plaintext password against a hash created using Argon2
 *
 * @param digest hash to check
 * @param password plaintext password to verify
 * @param secret secret (pepper) to use for hashing
 * @returns true if match, false otherwise
 */
export async function verify(
  digest: string,
  password: Buffer | string,
  secret?: Buffer<ArrayBufferLike>,
): Promise<boolean> {
  return argon2.verify(digest, password, { secret: secret || defaultSecret });
}
