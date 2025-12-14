import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../src/common/config/env';
import { createLogger } from '../src/common/config/logger';
import { PrismaClient } from '../src/common/db/generated/prisma/client';
import { hash } from '../src/common/util/argon2.util';
import { mockCreateAccountInput } from '../src/resources/accounts/dto/__mocks__/create-account.input.mock';
import { mockUpdateAccountInput } from '../src/resources/accounts/dto/__mocks__/update-account.input.mock';
import { CreateAccountInput } from '../src/resources/accounts/dto/create-account.input';
import { mockCreateUserInput } from '../src/resources/users/dto/__mocks__/create-user.input.mock';
import { mockUpdateUserInput } from '../src/resources/users/dto/__mocks__/update-user.input.mock';
import { CreateUserInput } from '../src/resources/users/dto/create-user.input';

/** Number of mock records to create for each table */
const MOCK_COUNT = 10;

const logger = createLogger();
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
async function main() {
  const upsertAdminOptions: CreateUserInput = {
    email: env.ADMIN_EMAIL,
    name: 'Administrator',
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
    providerId: 'local',
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
      create: mockCreateUserInput(),
      update: mockUpdateUserInput({ id }),
    });

    await prisma.account.upsert({
      where: { id },
      create: mockCreateAccountInput({ userId: id, accountId: `${id}` }),
      update: mockUpdateAccountInput({ id, userId: id, accountId: `${id}` }),
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
