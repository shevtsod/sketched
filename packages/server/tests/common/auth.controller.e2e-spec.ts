import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthToken } from '../../src/common/auth/auth.type';
import { createMockRegisterInput } from '../../src/common/auth/dto/__mocks__/register.input.mock';
import { env } from '../../src/common/config/env';
import { getAccessToken } from '../util/auth.util';
import { createApp } from '../util/create-app.util';

describe('(e2e) AuthController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApp();
  });

  it('POST /v1/auth/register', async () => {
    const input = await createMockRegisterInput();
    const { password, ...createUserInput } = input;

    // wrong method
    await request(app.getHttpServer()).get('/v1/auth/register').expect(404);

    // input omitted
    await request(app.getHttpServer()).post('/v1/auth/register').expect(400);

    // password omitted
    await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send(createUserInput)
      .expect(400);

    const res = await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send(input)
      .expect(201);

    expect(res.body).toMatchObject(createUserInput);
  });

  it('POST /v1/auth/guest', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/auth/guest')
      .expect(500);

    expect(res.body).toMatchObject({ message: 'Not Implemented' });
  });

  it('POST /v1/auth/login', async () => {
    const input = await createMockRegisterInput();
    const { username, password } = input;

    await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send(input)
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ username, password })
      .expect(201);

    const authToken: AuthToken = res.body;

    expect(authToken).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
        token_type: 'Bearer',
        refresh_token: expect.toBeOneOf([expect.any(String), undefined]),
        expires_in: expect.toBeOneOf([expect.any(Number), undefined]),
      }),
    );

    await request(app.getHttpServer())
      .get('/v1/auth/userinfo')
      .auth(authToken.access_token, { type: 'bearer' })
      .expect(200);
  });

  it('POST /v1/auth/refresh', async () => {
    const input = await createMockRegisterInput();
    const { username, password } = input;

    await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send(input)
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ username, password })
      .expect(201);

    const authToken: AuthToken = loginRes.body;

    // refresh without auth
    await request(app.getHttpServer()).post('/v1/auth/refresh').expect(401);

    const refreshRes = await request(app.getHttpServer())
      .post('/v1/auth/refresh')
      .auth(authToken.refresh_token!, { type: 'bearer' })
      .expect(201);

    expect(refreshRes.body).toMatchObject({
      access_token: expect.any(String),
      token_type: 'Bearer',
      refresh_token: expect.toBeOneOf([expect.any(String), undefined]),
      expires_in: expect.toBeOneOf([expect.any(Number), undefined]),
    });

    // refresh twice with the same refresh token
    await request(app.getHttpServer())
      .post('/v1/auth/refresh')
      .auth(authToken.access_token, { type: 'bearer' })
      .send({ refreshToken: authToken.refresh_token })
      .expect(401);
  });

  it('GET /v1/auth/userinfo', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/auth/userinfo')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        username: env.ADMIN_USERNAME,
        email: env.ADMIN_EMAIL,
      }),
    );
  });
});
