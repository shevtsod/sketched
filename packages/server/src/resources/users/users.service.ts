import { Injectable } from '@nestjs/common';
import { UserFindManyArgs } from '../../common/db/generated/prisma/models';
import { PrismaService } from '../../common/db/prisma.service';
import { PaginationArgs } from '../../common/graphql/pagination/pagination.args';
import {
  Direction,
  paginate,
  PaginateOptions,
} from '../../common/graphql/pagination/pagination.util';
import { User } from './entities/user.entity';
import { UserConnection } from './users.connection';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(...args: Parameters<typeof this.prisma.user.createManyAndReturn>) {
    return this.prisma.user.createManyAndReturn(...args);
  }

  findOne(...args: Parameters<typeof this.prisma.user.findFirst>) {
    return this.prisma.user.findFirst(...args);
  }

  findMany(...args: Parameters<typeof this.prisma.user.findMany>) {
    return this.prisma.user.findMany(...args);
  }

  paginate(
    paginationArgs: PaginationArgs,
    args: Pick<UserFindManyArgs, 'where' | 'include'>,
    paginateOptions?: PaginateOptions<User>,
  ): Promise<UserConnection> {
    const { where } = args;

    return paginate(
      paginationArgs,
      (user) => user.id,
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

  update(...args: Parameters<typeof this.prisma.user.updateManyAndReturn>) {
    return this.prisma.user.updateManyAndReturn(...args);
  }

  async delete(...args: Parameters<typeof this.prisma.user.deleteMany>) {
    const res = await this.findMany(...args);
    await this.prisma.user.deleteMany(...args);
    return res;
  }

  count(...args: Parameters<typeof this.prisma.user.count>) {
    return this.prisma.user.count(...args);
  }
}
