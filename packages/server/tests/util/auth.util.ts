import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AccessToken } from '../../src/common/auth/auth.type';
import { env } from '../../src/common/config/env';

// cached token
let cachedToken: AccessToken | undefined;
let cachedTokenExpiresAt: Date | undefined;

export async function getToken(app: INestApplication<App>) {
  if (
    cachedToken &&
    (cachedTokenExpiresAt === undefined || cachedTokenExpiresAt > new Date())
  ) {
    return cachedToken;
  }

  const res = await request(app.getHttpServer()).post('/auth/login').send({
    username: env.ADMIN_USERNAME,
    password: env.ADMIN_PASSWORD,
  });

  if (!res.body?.access_token) {
    throw new Error('Failed to get access token');
  }

  const accessToken: AccessToken = res.body;

  cachedToken = accessToken;

  if (accessToken.expires_in) {
    cachedTokenExpiresAt = new Date(Date.now() + accessToken.expires_in);
  } else {
    cachedTokenExpiresAt = undefined;
  }

  return cachedToken;
}

export async function getAccessToken(app: INestApplication<App>) {
  const token = await getToken(app);
  return token.access_token;
}
