import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthToken } from '../../src/common/auth/auth.type';
import { env } from '../../src/common/config/env';

// cached token
let cachedToken: AuthToken | undefined;
let cachedTokenExpiresAt: Date | undefined;

export async function getAuthToken(app: INestApplication<App>) {
  if (
    cachedToken &&
    (cachedTokenExpiresAt === undefined ||
      cachedTokenExpiresAt > new Date(Date.now() + 1000))
  ) {
    return cachedToken;
  }

  const res = await request(app.getHttpServer())
    .post('/v1/auth/login')
    .send({
      username: env.ADMIN_USERNAME,
      password: env.ADMIN_PASSWORD,
    })
    .expect(201);

  if (!res.body?.access_token) {
    throw new Error('Failed to get access token');
  }

  const authToken: AuthToken = res.body;

  cachedToken = authToken;

  if (authToken.expires_in) {
    cachedTokenExpiresAt = new Date(Date.now() + authToken.expires_in);
  } else {
    cachedTokenExpiresAt = undefined;
  }

  return cachedToken;
}

export async function getAccessToken(app: INestApplication<App>) {
  const token = await getAuthToken(app);
  return token.access_token;
}
