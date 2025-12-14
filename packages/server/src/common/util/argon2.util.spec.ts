import { argon2id } from 'argon2';
import { hash, verify } from './argon2.util';

const password = 'password';
const secret = Buffer.from('secret');

describe('argon2.util', () => {
  it('hashes a password', async () => {
    const digest = await hash(password, secret, {
      hashLength: 32,
      timeCost: 3,
      memoryCost: 65536,
      parallelism: 4,
      type: argon2id,
    });
    expect(digest.startsWith('$argon2id$v=19$m=65536,t=3,p=4$')).is.true;
  });

  it('verifies a hashed password', async () => {
    const digest = await hash(password, secret, {
      hashLength: 32,
      timeCost: 3,
      memoryCost: 65536,
      parallelism: 4,
      type: argon2id,
    });

    expect(verify(digest, 'wrong', secret)).resolves.toBe(false);
    expect(verify(digest, password, secret)).resolves.toBe(true);
  });
});
