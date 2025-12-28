import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createMockCreateSessionInput } from '../../src/resources/sessions/dto/__mocks__/create-session.input.mock';
import { createMockFindSessionInput } from '../../src/resources/sessions/dto/__mocks__/find-session.input.mock';
import { createMockUpdateSessionInput } from '../../src/resources/sessions/dto/__mocks__/update-session.input.mock';
import { Session } from '../../src/resources/sessions/entities/session.entity';
import { getAccessToken } from '../util/auth.util';
import { createApp } from '../util/create-app.util';

describe('(e2e) SessionsResolver', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApp();
  });

  it('requires auth', async () => {
    const query = `
      query Session($input: FindSessionInput!) {
        session(input: $input) {
          id
          userId
          token
          expiresAt
          ipAddress
          userAgent
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      input: await createMockFindSessionInput(),
    };

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query, variables });

    expect(res.body).toMatchObject({
      errors: expect.arrayContaining([
        expect.objectContaining({
          message: 'Unauthorized',
        }),
      ]),
    });
  });

  it('createSession', async () => {
    const query = `
      mutation CreateSession($input: CreateSessionInput!) {
        createSession(input: $input) {
          id
          userId
          token
          expiresAt
          ipAddress
          userAgent
          createdAt
          updatedAt
        }
      }
    `;

    const input = await createMockCreateSessionInput({ userId: 1 });
    const { token, ...inputRest } = input;

    const variables = {
      input,
    };

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query, variables });

    expect(res.body).toMatchObject({
      data: {
        createSession: {
          id: expect.any(Number),
          ...inputRest,
          expiresAt: inputRest.expiresAt.toISOString(),
        },
      },
    });
  });

  it('session', async () => {
    const query = `
      query Session($input: FindSessionInput!) {
        session(input: $input) {
          id
          userId
          token
          expiresAt
          ipAddress
          userAgent
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      input: {
        id: 1,
      },
    };

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query, variables });

    expect(res.body).toMatchObject({
      data: {
        session: {
          id: expect.any(Number),
          userId: expect.any(Number),
          token: null,
          expiresAt: expect.any(String),
          ipAddress: expect.toBeOneOf([expect.any(String), null]),
          userAgent: expect.toBeOneOf([expect.any(String), null]),
          createdAt: expect.any(String),
          updatedAt: expect.toBeOneOf([expect.any(String), null]),
        },
      },
    });
  });

  it('sessions', async () => {
    const query = `
      query Sessions($input: FindSessionsInput) {
        sessions(input: $input) {
          pageInfo {
            startCursor
            endCursor
            hasPreviousPage
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              userId
              token
              expiresAt
              ipAddress
              userAgent
              createdAt
              updatedAt
            }
          }
          totalCount
        }
      }
    `;

    const variables = {
      input: null,
    };

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query, variables });

    expect(res.body).toMatchObject({
      data: {
        sessions: expect.objectContaining({
          totalCount: expect.any(Number),
          pageInfo: {
            startCursor: expect.any(String),
            endCursor: expect.any(String),
            hasPreviousPage: expect.any(Boolean),
            hasNextPage: expect.any(Boolean),
          },
          edges: expect.arrayContaining([
            {
              cursor: expect.any(String),
              node: expect.objectContaining({
                id: expect.any(Number),
                userId: expect.any(Number),
                token: null,
                expiresAt: expect.any(String),
                ipAddress: expect.toBeOneOf([expect.any(String), null]),
                userAgent: expect.toBeOneOf([expect.any(String), null]),
                createdAt: expect.any(String),
                updatedAt: expect.toBeOneOf([expect.any(String), null]),
              }),
            },
          ]),
        }),
      },
    });
  });

  it('updateSession', async () => {
    const createQuery = `
      mutation CreateSession($input: CreateSessionInput!) {
        createSession(input: $input) {
          id
        }
      }
    `;

    const createVariables = {
      input: await createMockCreateSessionInput({ userId: 1 }),
    };

    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: createQuery, variables: createVariables });

    expect(createRes.body).toMatchObject({
      data: {
        createSession: {
          id: expect.any(Number),
        },
      },
    });

    const session: Session = createRes.body.data.createSession;

    const updateQuery = `
      mutation UpdateSession($input: UpdateSessionInput!) {
        updateSession(input: $input) {
          id
          userId
          token
          expiresAt
          ipAddress
          userAgent
          createdAt
          updatedAt
        }
      }
    `;

    const { id, token, ...inputRest } = await createMockUpdateSessionInput({
      userId: 1,
    });

    const updateVariables = {
      input: { ...inputRest, token, id: session.id },
    };

    const updateRes = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: updateQuery, variables: updateVariables });

    expect(updateRes.body).toMatchObject({
      data: {
        updateSession: {
          id: session.id,
          ...inputRest,
          expiresAt: inputRest.expiresAt.toISOString(),
        },
      },
    });
  });

  it('deleteSession', async () => {
    const createQuery = `
      mutation CreateSession($input: CreateSessionInput!) {
        createSession(input: $input) {
          id
        }
      }
    `;

    const createVariables = {
      input: await createMockCreateSessionInput({ userId: 1 }),
    };

    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: createQuery, variables: createVariables });

    expect(createRes.body).toMatchObject({
      data: {
        createSession: {
          id: expect.any(Number),
        },
      },
    });

    const session: Session = createRes.body.data.createSession;

    const deleteQuery = `
      mutation DeleteSession($input: FindSessionInput!) {
        deleteSession(input: $input) {
          id
          userId
          token
          expiresAt
          ipAddress
          userAgent
          createdAt
          updatedAt
        }
      }
    `;

    const deleteVariables = {
      input: {
        id: session.id,
      },
    };

    const deleteRes = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: deleteQuery, variables: deleteVariables });

    expect(deleteRes.body).toMatchObject({
      data: {
        deleteSession: session,
      },
    });
  });

  it('user', async () => {
    const query = `
      query Sessions($sessionsInput: FindSessionsInput) {
        sessions(input: $sessionsInput) {
          edges {
            node {
              user {
                id
                username
                email
                image
                createdAt
                updatedAt
              }
            }
          }
        }
      }
    `;

    const variables = {
      sessionsInput: null,
      usersInput: null,
    };

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query, variables });

    expect(res.body).toMatchObject({
      data: {
        sessions: expect.objectContaining({
          edges: expect.arrayContaining([
            {
              node: expect.objectContaining({
                user: expect.objectContaining({
                  id: expect.any(Number),
                  username: expect.any(String),
                  email: expect.any(String),
                  image: expect.toBeOneOf([expect.any(String), null]),
                  createdAt: expect.any(String),
                  updatedAt: expect.toBeOneOf([expect.any(String), null]),
                }),
              }),
            },
          ]),
        }),
      },
    });
  });
});
