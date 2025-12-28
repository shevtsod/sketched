import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { getAccessToken } from '../util/auth.util';
import { createApp } from '../util/create-app.util';

describe('(e2e) GraphQLModule', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApp();
  });

  it('GET /graphql', async () => {
    return request(app.getHttpServer())
      .get('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .expect(400);
  });

  it('POST /graphql', async () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .expect(400);
  });

  it('GET /graphql (GraphiQL)', async () => {
    return request(app.getHttpServer())
      .get('/graphql')
      .set('Accept', 'text/html')
      .expect(200);
  });
});
