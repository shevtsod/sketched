import { faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../src/common/config/env';
import { createLogger } from '../src/common/config/logger';
import { hash } from '../src/common/crypto/argon2/argon2.util';
import { PrismaClient } from '../src/common/db/generated/prisma/client';
import { createMockCreateAccountInput } from '../src/resources/accounts/dto/__mocks__/create-account.input.mock';
import { createMockUpdateAccountInput } from '../src/resources/accounts/dto/__mocks__/update-account.input.mock';
import { CreateAccountInput } from '../src/resources/accounts/dto/create-account.input';
import { Provider } from '../src/resources/accounts/entities/provider.enum';
import { createMockCreateSessionInput } from '../src/resources/sessions/dto/__mocks__/create-session.input.mock';
import { createMockUpdateSessionInput } from '../src/resources/sessions/dto/__mocks__/update-session.input.mock';
import { createMockCreateUserInput } from '../src/resources/users/dto/__mocks__/create-user.input.mock';
import { createMockUpdateUserInput } from '../src/resources/users/dto/__mocks__/update-user.input.mock';
import { CreateUserInput } from '../src/resources/users/dto/create-user.input';

/** Number of mock records to create for each table */
const MOCK_COUNT = 10;

const logger = createLogger();
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
async function main() {
  const upsertAdminOptions: CreateUserInput = {
    username: env.ADMIN_USERNAME,
    email: env.ADMIN_EMAIL,
  };

  await prisma.user.upsert({
    where: { id: 1 },
    create: upsertAdminOptions,
    update: upsertAdminOptions,
  });

  const adminAccount = await prisma.account.findFirst({
    where: { userId: 1, providerId: 'local', accountId: '1' },
  });

  const upsertAdminAccountOptions: CreateAccountInput = {
    userId: 1,
    providerId: Provider.Local,
    accountId: '1',
    password: await hash(env.ADMIN_PASSWORD),
  };

  if (adminAccount) {
    await prisma.account.update({
      where: { id: adminAccount.id },
      data: upsertAdminAccountOptions,
    });
  } else {
    await prisma.account.create({ data: upsertAdminAccountOptions });
  }

  if (!env.isDevOrTest) {
    return;
  }

  logger.info(`NODE_ENV="${env.NODE_ENV}". Seeding mock records ...`);

  for (let id = 2; id < 12; id++) {
    await prisma.user.upsert({
      where: { id },
      create: await createMockCreateUserInput(),
      update: await createMockUpdateUserInput({ id }),
    });

    const createAccountInput: CreateAccountInput = {
      userId: id,
      accountId: `${id}`,
      providerId: Provider.Local,
      password: await hash(faker.internet.password()),
    };

    await prisma.account.upsert({
      where: { id },
      create: await createMockCreateAccountInput(createAccountInput),
      update: await createMockUpdateAccountInput({ id, ...createAccountInput }),
    });

    await prisma.session.upsert({
      where: { id },
      create: await createMockCreateSessionInput({ userId: id }),
      update: await createMockUpdateSessionInput({ id, userId: id }),
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    logger.error({ error });
    await prisma.$disconnect();
    process.exit(1);
  });
