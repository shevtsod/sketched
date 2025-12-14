import { Injectable } from '@nestjs/common';
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

  create(...args: Parameters<typeof this.prisma.account.createManyAndReturn>) {
    return this.prisma.account.createManyAndReturn(...args);
  }

  findOne(...args: Parameters<typeof this.prisma.account.findFirst>) {
    return this.prisma.account.findFirst(...args);
  }

  findMany(...args: Parameters<typeof this.prisma.account.findMany>) {
    return this.prisma.account.findMany(...args);
  }

  paginate(
    paginationArgs: PaginationArgs,
    args: Pick<AccountFindManyArgs, 'where' | 'include'>,
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

  update(...args: Parameters<typeof this.prisma.account.updateManyAndReturn>) {
    return this.prisma.account.updateManyAndReturn(...args);
  }

  async delete(...args: Parameters<typeof this.prisma.account.deleteMany>) {
    const res = await this.findMany(...args);
    await this.prisma.account.deleteMany(...args);
    return res;
  }

  count(...args: Parameters<typeof this.prisma.account.count>) {
    return this.prisma.account.count(...args);
  }
}
