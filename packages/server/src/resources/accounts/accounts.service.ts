import { Injectable } from '@nestjs/common';
import { hash } from '../../common/crypto/argon2/argon2.util';
import { AccountFindManyArgs } from '../../common/db/generated/prisma/models';
import { PrismaService } from '../../common/db/prisma.service';
import { PaginationArgs } from '../../common/graphql/pagination/pagination.args';
import {
  Direction,
  paginate,
  PaginateOptions,
} from '../../common/graphql/pagination/pagination.util';
import { AccountConnection } from './accounts.connection';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    ...args: Parameters<typeof this.prisma.account.createManyAndReturn>
  ) {
    const input = args[0];

    if (input?.data !== undefined) {
      const data = Array.isArray(input.data) ? input.data : [input.data];

      for (const datum of data) {
        // hash password
        if (typeof datum.password === 'string') {
          datum.password = await hash(datum.password);
        }
      }
    }

    return this.prisma.account.createManyAndReturn(...args);
  }

  findOne(...args: Parameters<typeof this.prisma.account.findFirst>) {
    return this.prisma.account.findFirst(...args);
  }

  async findUnique(...args: Parameters<typeof this.prisma.account.findUnique>) {
    return this.prisma.account.findUnique(...args);
  }

  findMany(...args: Parameters<typeof this.prisma.account.findMany>) {
    return this.prisma.account.findMany(...args);
  }

  paginate(
    paginationArgs: PaginationArgs,
    args: Pick<AccountFindManyArgs, 'where' | 'select'>,
    paginateOptions?: PaginateOptions<Account>,
  ): Promise<AccountConnection> {
    const { where } = args;

    return paginate(
      paginationArgs,
      (account) => account.id,
      (limit, direction, cursor) =>
        this.prisma.$transaction([
          this.findMany({
            ...args,
            take: direction === Direction.ASC ? limit : -limit,
            skip: cursor !== undefined ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { id: 'asc' },
          }),
          this.count({ where }),
        ]),
      paginateOptions,
    );
  }

  async update(
    ...args: Parameters<typeof this.prisma.account.updateManyAndReturn>
  ) {
    const { data } = args[0];

    // hash password
    if (typeof data.password === 'string') {
      data.password = await hash(data.password);
    }

    return this.prisma.account.updateManyAndReturn(...args);
  }

  async upsert(...args: Parameters<typeof this.prisma.account.upsert>) {
    const input = args[0];

    if (input?.create !== undefined) {
      const { create } = input;

      // hash password
      if (typeof create.password === 'string') {
        create.password = await hash(create.password);
      }
    }

    if (input?.update !== undefined) {
      const { update } = input;

      // hash password
      if (typeof update.password === 'string') {
        update.password = await hash(update.password);
      }
    }

    return this.prisma.account.upsert(...args);
  }

  async delete(...args: Parameters<typeof this.prisma.account.deleteMany>) {
    const [input, ...rest] = args;
    const { where } = input ?? {};
    const res = await this.findMany(...args);
    await this.prisma.account.deleteMany({ where }, ...rest);
    return res;
  }

  count(...args: Parameters<typeof this.prisma.account.count>) {
    return this.prisma.account.count(...args);
  }
}
