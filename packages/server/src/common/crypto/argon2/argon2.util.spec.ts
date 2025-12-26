import { faker } from '@faker-js/faker';
import argon2 from 'argon2';
import { hash, verify } from './argon2.util';

const spyHash = vi.spyOn(argon2, 'hash');
const spyVerify = vi.spyOn(argon2, 'verify');

describe('argon2.util', () => {
  it('hashes a password', async () => {
    const password = faker.string.alphanumeric({ length: 10 });
    const secret = Buffer.from(faker.string.alphanumeric({ length: 10 }));
    const digest = faker.string.alphanumeric({ length: 10 });
    spyHash.mockResolvedValueOnce(digest);
    const res = await hash(password, secret, {
      hashLength: 32,
      timeCost: 3,
      memoryCost: 65536,
      parallelism: 4,
      type: argon2.argon2id,
    });
    expect(res).toBe(digest);
  });

  it('verifies a hashed password', async () => {
    const password = faker.string.alphanumeric({ length: 10 });
    const secret = Buffer.from(faker.string.alphanumeric({ length: 10 }));
    const digest = faker.string.alphanumeric({ length: 10 });
    spyHash.mockResolvedValueOnce(digest);
    spyVerify.mockImplementation(async (_, str) => str === password);
    const res = await hash(password, secret, {
      hashLength: 32,
      timeCost: 3,
      memoryCost: 65536,
      parallelism: 4,
      type: argon2.argon2id,
    });

    await expect(
      verify(res, faker.string.alphanumeric({ length: 10 }), secret),
    ).resolves.toBe(false);
    await expect(verify(res, password, secret)).resolves.toBe(true);
  });
});
