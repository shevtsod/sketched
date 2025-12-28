import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createMockCreateAccountInput } from '../../src/resources/accounts/dto/__mocks__/create-account.input.mock';
import { createMockFindAccountInput } from '../../src/resources/accounts/dto/__mocks__/find-account.input.mock';
import { createMockUpdateAccountInput } from '../../src/resources/accounts/dto/__mocks__/update-account.input.mock';
import { Account } from '../../src/resources/accounts/entities/account.entity';
import { createMockCreateUserInput } from '../../src/resources/users/dto/__mocks__/create-user.input.mock';
import { User } from '../../src/resources/users/entities/user.entity';
import { getAccessToken } from '../util/auth.util';
import { createApp } from '../util/create-app.util';

describe('(e2e) AccountsResolver', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApp();
  });

  it('requires auth', async () => {
    const query = `
      query Account($input: FindAccountInput!) {
        account(input: $input) {
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
    `;

    const variables = {
      input: await createMockFindAccountInput(),
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

  it('createAccount', async () => {
    const createUserQuery = `
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

    const createUserVariables = {
      input: await createMockCreateUserInput(),
    };

    const createUserRes = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: createUserQuery, variables: createUserVariables });

    const user: User = createUserRes.body.data.createUser;

    const createQuery = `
      mutation CreateAccount($input: CreateAccountInput!) {
        createAccount(input: $input) {
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
    `;

    const input = await createMockCreateAccountInput({ userId: user.id });
    const {
      accessToken,
      refreshToken,
      scope,
      idToken,
      password,
      ...inputRest
    } = input;

    const createVariables = {
      input,
    };

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: createQuery, variables: createVariables });

    expect(res.body).toMatchObject({
      data: {
        createAccount: {
          id: expect.any(Number),
          ...inputRest,
          accessTokenExpiresAt: inputRest.accessTokenExpiresAt?.toISOString(),
          refreshTokenExpiresAt: inputRest.refreshTokenExpiresAt?.toISOString(),
        },
      },
    });
  });

  it('account', async () => {
    const query = `
      query Account($input: FindAccountInput!) {
        account(input: $input) {
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
        account: {
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
        },
      },
    });
  });

  it('accounts', async () => {
    const query = `
      query Accounts($input: FindAccountsInput) {
        accounts(input: $input) {
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
        accounts: expect.objectContaining({
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
      },
    });
  });

  it('updateAccount', async () => {
    const createUserQuery = `
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

    const createUserVariables = {
      input: await createMockCreateUserInput(),
    };

    const createUserRes = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: createUserQuery, variables: createUserVariables });

    const user: User = createUserRes.body.data.createUser;

    const createQuery = `
      mutation CreateAccount($input: CreateAccountInput!) {
        createAccount(input: $input) {
          id
        }
      }
    `;

    const createVariables = {
      input: await createMockCreateAccountInput({ userId: user.id }),
    };

    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: createQuery, variables: createVariables });

    expect(createRes.body).toMatchObject({
      data: {
        createAccount: {
          id: expect.any(Number),
        },
      },
    });

    const account: Account = createRes.body.data.createAccount;

    const updateQuery = `
      mutation UpdateAccount($input: UpdateAccountInput!) {
        updateAccount(input: $input) {
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
    `;

    const {
      id,
      accessToken,
      refreshToken,
      scope,
      idToken,
      password,
      ...inputRest
    } = await createMockUpdateAccountInput({
      userId: user.id,
    });

    const updateVariables = {
      input: {
        ...inputRest,
        accessToken,
        refreshToken,
        scope,
        idToken,
        password,
        id: account.id,
      },
    };

    const updateRes = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: updateQuery, variables: updateVariables });

    expect(updateRes.body).toMatchObject({
      data: {
        updateAccount: {
          id: account.id,
          ...inputRest,
          accessTokenExpiresAt: inputRest.accessTokenExpiresAt?.toISOString(),
          refreshTokenExpiresAt: inputRest.refreshTokenExpiresAt?.toISOString(),
        },
      },
    });
  });

  it('deleteAccount', async () => {
    const createUserQuery = `
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

    const createUserVariables = {
      input: await createMockCreateUserInput(),
    };

    const createUserRes = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: createUserQuery, variables: createUserVariables });

    const user: User = createUserRes.body.data.createUser;

    const createQuery = `
      mutation CreateAccount($input: CreateAccountInput!) {
        createAccount(input: $input) {
          id
        }
      }
    `;

    const createVariables = {
      input: await createMockCreateAccountInput({ userId: user.id }),
    };

    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: createQuery, variables: createVariables });

    expect(createRes.body).toMatchObject({
      data: {
        createAccount: {
          id: expect.any(Number),
        },
      },
    });

    const account: Account = createRes.body.data.createAccount;

    const deleteQuery = `
      mutation DeleteAccount($input: FindAccountInput!) {
        deleteAccount(input: $input) {
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
    `;

    const deleteVariables = {
      input: {
        id: account.id,
      },
    };

    const deleteRes = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query: deleteQuery, variables: deleteVariables });

    expect(deleteRes.body).toMatchObject({
      data: {
        deleteAccount: account,
      },
    });
  });

  it('user', async () => {
    const query = `
      query Accounts($accountsInput: FindAccountsInput) {
        accounts(input: $accountsInput) {
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
      accountsInput: null,
      usersInput: null,
    };

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .auth(await getAccessToken(app), { type: 'bearer' })
      .send({ query, variables });

    expect(res.body).toMatchObject({
      data: {
        accounts: expect.objectContaining({
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
