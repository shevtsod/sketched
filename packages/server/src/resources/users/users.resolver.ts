import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { and, asc, desc, eq, gt, lt } from 'drizzle-orm';
import { users } from '../../db/schema';
import {
  decodeCursor,
  encodeCursor,
} from '../../graphql/pagination/cursor.util';
import { PageInfo } from '../../graphql/pagination/page-info';
import { PaginationArgs } from '../../graphql/pagination/pagination.args';
import { CreateUserInput } from './dto/create-user.input';
import { FindUserInput } from './dto/find-user.input';
import { FindUsersInput } from './dto/find-users.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserConnection, UserEdge } from './users.connection';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput).then((res) => res[0]);
  }

  @Query(() => UserConnection)
  async users(
    @Args() pagination: PaginationArgs,
    @Args('findUsersInput', { nullable: true }) findUsersInput?: FindUsersInput,
  ): Promise<UserConnection> {
    const { after, before, first, last } = pagination;

    const order = last ? desc : asc;
    const dir = last ? lt : gt;
    const limit = last ?? first ?? 10;
    const cursor = order === desc ? before : after;
    const decodedCursor = cursor ? Number(decodeCursor(cursor)) : undefined;

    const conditions = Object.entries(findUsersInput ?? {})
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => eq(users[k], v));

    const [rows, totalCount] = await this.usersService.findMany({
      where: and(
        decodedCursor ? dir(users.id, decodedCursor) : undefined,
        ...conditions,
      ),
      limit: limit + 1,
      orderBy: [order(users.id)],
    });

    const hasExtraRow = rows.length > limit;
    let items = hasExtraRow ? rows.slice(0, limit) : rows;

    // Maintain order if backward pagination
    items = order === desc ? items.reverse() : items;

    const edges: UserEdge[] = items.map((node) => ({
      node,
      cursor: encodeCursor(node.id),
    }));

    const pageInfo: PageInfo = {
      startCursor: edges[0]?.cursor ?? null,
      endCursor: edges[edges.length - 1]?.cursor ?? null,
      hasPreviousPage: last ? hasExtraRow : !!before,
      hasNextPage: first ? hasExtraRow : !!after,
    };

    return {
      edges,
      pageInfo,
      totalCount,
    };
  }

  @Query(() => User)
  user(
    @Args('findUserInput') { id }: FindUserInput,
  ): Promise<User | undefined> {
    return this.usersService.findOne({ where: eq(users.id, id) });
  }

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') { id, ...updateUserInput }: UpdateUserInput,
  ): Promise<User> {
    return this.usersService
      .update({
        where: eq(users.id, id),
        set: updateUserInput,
      })
      .then((res) => res[0]);
  }

  @Mutation(() => User)
  deleteUser(@Args('findUserInput') { id }: FindUserInput): Promise<User> {
    return this.usersService
      .delete({ where: eq(users.id, id) })
      .then((res) => res[0]);
  }
}
