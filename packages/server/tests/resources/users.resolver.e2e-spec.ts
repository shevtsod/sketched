import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { env } from '../../src/common/config/env';
import { createMockCreateUserInput } from '../../src/resources/users/dto/__mocks__/create-user.input.mock';
import { createMockFindUserInput } from '../../src/resources/users/dto/__mocks__/find-user.input.mock';
import { createMockUpdateUserInput } from '../../src/resources/users/dto/__mocks__/update-user.input.mock';
import { User } from '../../src/resources/users/entities/user.entity';
import { getAccessToken } from '../util/auth.util';
import { createApp } from '../util/create-app.util';

describe('(e2e) UsersResolver', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApp();
  });

  it('requires auth', async () => {
    const query = `
      query User($input: FindUserInput!) {
        user(input: $input) {
          id
          username
          email
          image
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      input: await createMockFindUserInput(),
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

  it('createUser', async () => {
    const query = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          username
          email
          image
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      input: await createMockCreateUserInput(),
    };

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query, variables });

    expect(res.body).toMatchObject({
      data: {
        createUser: {
          id: expect.any(Number),
          ...variables.input,
        },
      },
    });
  });

  it('user', async () => {
    const query = `
      query User($input: FindUserInput!) {
        user(input: $input) {
          id
          username
          email
          image
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
        user: {
          id: 1,
          username: env.ADMIN_USERNAME,
          email: env.ADMIN_EMAIL,
          createdAt: expect.any(String),
        },
      },
    });
  });

  it('users', async () => {
    const query = `
      query Users($input: FindUsersInput) {
        users(input: $input) {
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
              username
              email
              image
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
        users: expect.objectContaining({
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
                username: expect.any(String),
                email: expect.any(String),
                image: expect.toBeOneOf([expect.any(String), null]),
                createdAt: expect.any(String),
                updatedAt: expect.toBeOneOf([expect.any(String), null]),
              }),
            },
          ]),
        }),
      },
    });
  });

  it('updateUser', async () => {
    const createQuery = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
        }
      }
    `;

    const createVariables = {
      input: await createMockCreateUserInput(),
    };

    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: createQuery, variables: createVariables });

    expect(createRes.body).toMatchObject({
      data: {
        createUser: {
          id: expect.any(Number),
        },
      },
    });

    const user: User = createRes.body.data.createUser;

    const updateQuery = `
      mutation UpdateUser($input: UpdateUserInput!) {
        updateUser(input: $input) {
          id
          username
          email
          image
          createdAt
          updatedAt
        }
      }
    `;

    const { id, ...inputRest } = await createMockUpdateUserInput();

    const updateVariables = {
      input: { ...inputRest, id: user.id },
    };

    const updateRes = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: updateQuery, variables: updateVariables });

    expect(updateRes.body).toMatchObject({
      data: {
        updateUser: {
          id: user.id,
          ...inputRest,
        },
      },
    });
  });

  it('deleteUser', async () => {
    const createQuery = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
        }
      }
    `;

    const createVariables = {
      input: await createMockCreateUserInput(),
    };

    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: createQuery, variables: createVariables });

    expect(createRes.body).toMatchObject({
      data: {
        createUser: {
          id: expect.any(Number),
        },
      },
    });

    const user: User = createRes.body.data.createUser;

    const deleteQuery = `
      mutation DeleteUser($input: FindUserInput!) {
        deleteUser(input: $input) {
          id
          username
          email
          image
          createdAt
          updatedAt
        }
      }
    `;

    const deleteVariables = {
      input: {
        id: user.id,
      },
    };

    const deleteRes = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: deleteQuery, variables: deleteVariables });

    expect(deleteRes.body).toMatchObject({
      data: {
        deleteUser: user,
      },
    });
  });

  it('accounts', async () => {
    const query = `
      query Users($usersInput: FindUsersInput, $accountsInput: FindAccountsInput) {
        users(input: $usersInput) {
          edges {
            node {
              accounts(input: $accountsInput) {
                edges {
                  cursor
                  node {
                    id
                    userId
                    providerId
                    accountId
                    accessToken
                    refreshToken
                    accessTokenExpiresAt
                    refreshTokenExpiresAt
                    scope
                    idToken
                    password
                    createdAt
                    updatedAt
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      usersInput: null,
      accountsInput: null,
    };

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query, variables });

    expect(res.body).toMatchObject({
      data: {
        users: expect.objectContaining({
          edges: expect.arrayContaining([
            {
              node: expect.objectContaining({
                accounts: expect.objectContaining({
                  edges: expect.arrayContaining([
                    {
                      cursor: expect.any(String),
                      node: expect.objectContaining({
                        id: expect.any(Number),
                        userId: expect.any(Number),
                        providerId: expect.any(String),
                        accountId: expect.any(String),
                        accessToken: null,
                        refreshToken: null,
                        scope: null,
                        idToken: null,
                        password: null,
                        createdAt: expect.any(String),
                        updatedAt: expect.toBeOneOf([expect.any(String), null]),
                      }),
                    },
                  ]),
                }),
              }),
            },
          ]),
        }),
      },
    });
  });

  it('sessions', async () => {
    const query = `
      query Users($usersInput: FindUsersInput, $sessionsInput: FindSessionsInput) {
        users(input: $usersInput) {
          edges {
            node {
              sessions(input: $sessionsInput) {
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
              }
            }
          }
        }
      }
    `;

    const variables = {
      usersInput: null,
      sessionsInput: null,
    };

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query, variables });

    expect(res.body).toMatchObject({
      data: {
        users: expect.objectContaining({
          edges: expect.arrayContaining([
            {
              node: expect.objectContaining({
                sessions: expect.objectContaining({
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
              }),
            },
          ]),
        }),
      },
    });
  });
});
