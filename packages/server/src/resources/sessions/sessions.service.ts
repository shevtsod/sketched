import { Injectable } from '@nestjs/common';
import { hash } from '../../common/crypto/argon2/argon2.util';
import { SessionFindManyArgs } from '../../common/db/generated/prisma/models';
import { PrismaService } from '../../common/db/prisma.service';
import { PaginationArgs } from '../../common/graphql/pagination/pagination.args';
import {
  Direction,
  paginate,
  PaginateOptions,
} from '../../common/graphql/pagination/pagination.util';
import { Session } from './entities/session.entity';
import { SessionConnection } from './sessions.connection';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    ...args: Parameters<typeof this.prisma.session.createManyAndReturn>
  ) {
    const input = args[0];

    if (input?.data !== undefined) {
      const data = Array.isArray(input.data) ? input.data : [input.data];

      for (const datum of data) {
        // hash token
        datum.token = await hash(datum.token);
      }
    }

    return this.prisma.session.createManyAndReturn(...args);
  }

  findOne(...args: Parameters<typeof this.prisma.session.findFirst>) {
    return this.prisma.session.findFirst(...args);
  }

  async findUnique(...args: Parameters<typeof this.prisma.session.findUnique>) {
    return this.prisma.session.findUnique(...args);
  }

  findMany(...args: Parameters<typeof this.prisma.session.findMany>) {
    return this.prisma.session.findMany(...args);
  }

  paginate(
    paginationArgs: PaginationArgs,
    args: Pick<SessionFindManyArgs, 'where' | 'select'>,
    paginateOptions?: PaginateOptions<Session>,
  ): Promise<SessionConnection> {
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
    ...args: Parameters<typeof this.prisma.session.updateManyAndReturn>
  ) {
    const { data } = args[0];

    // hash token
    if (typeof data.token === 'string') {
      data.token = await hash(data.token);
    }

    return this.prisma.session.updateManyAndReturn(...args);
  }

  async upsert(...args: Parameters<typeof this.prisma.session.upsert>) {
    const input = args[0];

    if (input?.create !== undefined) {
      const { create } = input;

      // hash token
      if (typeof create.token === 'string') {
        create.token = await hash(create.token);
      }
    }

    if (input?.update !== undefined) {
      const { update } = input;

      // hash token
      if (typeof update.token === 'string') {
        update.token = await hash(update.token);
      }
    }

    return this.prisma.session.upsert(...args);
  }

  async delete(...args: Parameters<typeof this.prisma.session.deleteMany>) {
    const [input, ...rest] = args;
    const { where } = input ?? {};
    const res = await this.findMany(...args);
    await this.prisma.session.deleteMany({ where }, ...rest);
    return res;
  }

  count(...args: Parameters<typeof this.prisma.session.count>) {
    return this.prisma.session.count(...args);
  }
}
