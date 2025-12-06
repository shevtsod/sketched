import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { and, asc, eq, gt, lt } from 'drizzle-orm';
import { users } from '../../common/db/schema';
import { PaginationArgs } from '../../common/graphql/pagination/pagination.args';
import {
  Direction,
  paginate,
} from '../../common/graphql/pagination/pagination.util';
import { CreateUserInput } from './dto/create-user.input';
import { FindUserInput } from './dto/find-user.input';
import { FindUsersInput } from './dto/find-users.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserConnection } from './users.connection';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    const res = await this.usersService.create(createUserInput);
    return res[0];
  }

  @Query(() => UserConnection)
  async users(
    @Args() pagination: PaginationArgs,
    @Args('findUsersInput', { nullable: true }) findUsersInput?: FindUsersInput,
  ): Promise<UserConnection> {
    return paginate(
      pagination,
      (user) => user.id,
      (limit, direction, cursor) => {
        const operator = direction === Direction.ASC ? gt : lt;
        const conditions = Object.entries(findUsersInput ?? {})
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => eq(users[k], v));

        return this.usersService.findManyWithCount({
          where: and(
            cursor ? operator(users.id, cursor) : undefined,
            ...conditions,
          ),
          limit,
          orderBy: asc(users.id),
        });
      },
    );
  }

  @Query(() => User)
  user(
    @Args('findUserInput') { id }: FindUserInput,
  ): Promise<User | undefined> {
    return this.usersService.findOne({ where: eq(users.id, id) });
  }

  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') { id, ...updateUserInput }: UpdateUserInput,
  ): Promise<User> {
    const res = this.usersService.update(eq(users.id, id), updateUserInput);
    return res[0];
  }

  @Mutation(() => User)
  async deleteUser(
    @Args('findUserInput') { id }: FindUserInput,
  ): Promise<User> {
    const res = await this.usersService.delete(eq(users.id, id));
    return res[0];
  }
}
