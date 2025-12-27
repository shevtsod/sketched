import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { env } from '../src/common/config/env';
import { User } from '../src/resources/users/entities/user.entity';
import { getAccessToken } from './util/auth.util';
import { createApp } from './util/create-app.util';

describe('(e2e) AppModule', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApp();
  });

  it('GET /graphql (GraphiQL)', async () => {
    return request(app.getHttpServer())
      .get('/graphql')
      .set('Accept', 'text/html')
      .expect(200);
  });

  it('GET /auth/userinfo', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/userinfo')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .expect(200);

    const body: User = res.body;
    expect(body).toEqual(
      expect.objectContaining({
        username: env.ADMIN_USERNAME,
        email: env.ADMIN_EMAIL,
      }),
    );
  });
});
